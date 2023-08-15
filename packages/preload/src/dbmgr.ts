import type {player, regole, teamInfo} from './interfaces';
import Database from 'better-sqlite3';
const db = new Database('./fanta.sqlite3');

db.pragma('journal_mode = WAL');
(async () => {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS "giocatori" (
	"id"	INTEGER,
	"nome"	TEXT,
	"squadra"	TEXT,
	"ruolo"	TEXT,
	"quotazione"	REAL,
	"trequartista"	INTEGER DEFAULT 0,
	"squadra_fanta"	INTEGER,
	FOREIGN KEY("squadra_fanta") REFERENCES "squadre"("id") ON DELETE SET NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
)`,
  ).run();
  db.prepare(
    `CREATE TABLE IF NOT EXISTS "regole" (
	"id"	INTEGER,
	"finanze_iniziali"	INTEGER DEFAULT 0,
	"max_rosa"	INTEGER DEFAULT 0,
	"max_atk"	INTEGER DEFAULT 0,
	"max_dc"	INTEGER DEFAULT 0,
	"max_por"	INTEGER DEFAULT 0,
	"max_cc"	INTEGER DEFAULT 0,
	PRIMARY KEY("id" AUTOINCREMENT)
)`,
  ).run();
  db.prepare(
    `CREATE TABLE IF NOT EXISTS "squadre" (
	"id"	INTEGER UNIQUE,
	"nome"	TEXT,
	"finanze"	INTEGER DEFAULT 0,
	UNIQUE("nome"),
	PRIMARY KEY("id" AUTOINCREMENT)
)`,
  ).run();
})();
export default class testmgr {
  addName = async (newName: string) => {
    const regole: regole = await this.getRegole();
    return new Promise((resolve, reject) => {
      if (!(newName.length > 0)) reject('Nome vuoto!');
      try {
        db.exec('BEGIN');
        const sql = `INSERT INTO squadre(nome,finanze) VALUES('${newName}',${regole.finanze_iniziali})`;
        db.prepare(sql).run();
        db.exec('COMMIT');
      } catch (error) {
        reject((error as {message: string}).message);
      }
      resolve(true);
    });
  };
  addPlayerToTeam = async (player: player, team: teamInfo, playerPrice: number) => {
    const regole = await this.getRegole();
    return new Promise((resolve, reject) => {
      let failed = false;
      let message = '';
      switch (player.ruolo) {
        case 'A': {
          if (team.tot_A >= regole.max_atk) {
            failed = true;
            message = 'Questa squadra ha già raggiunto il numero massimo di attaccanti in rosa.';
          }
          break;
        }
        case 'C': {
          if (team.tot_C >= regole.max_cc) {
            failed = true;
            message =
              'Questa squadra ha già raggiunto il numero massimo di centrocampisti in rosa.';
          }
          break;
        }
        case 'D': {
          if (team.tot_D >= regole.max_dc) {
            console.log(team.tot_D, regole.max_dc);
            message = 'Questa squadra ha già raggiunto il numero massimo di difensori in rosa.';
            failed = true;
          }
          break;
        }
        case 'P': {
          if (team.tot_P >= regole.max_por) {
            message = 'Questa squadra ha già raggiunto il numero massimo di portieri in rosa.';
            failed = true;
          }
          break;
        }
        default: {
          message = 'Non esiste sto giocatore ao!';
          failed = true;
        }
      }
      if (failed) return reject(message);
      if (playerPrice > team.finanze) {
        return reject('Questa squadra non ha abbastanza soldi per effettuare l acquisto.');
      }
      if (regole.max_rosa <= team.tot_giocatori) {
        return reject('Questa squadra non ha più slot giocatori disponibili.');
      }
      db.exec('BEGIN');
      db.prepare(
        'UPDATE giocatori SET squadra_fanta = $team_id, prezzo_acquisto = $prezzo_acquisto WHERE id=$player_id',
      ).run({
        team_id: team.id,
        player_id: player.id,
        prezzo_acquisto: playerPrice,
      });

      db.prepare('UPDATE squadre SET finanze=finanze - $playerValue WHERE id=$team_id').run({
        playerValue: playerPrice,
        team_id: team.id,
      });
      db.exec('COMMIT');
      resolve(true);
    });
  };
  addPlayers = (data: player[]) => {
    return new Promise((resolve, reject) => {
      const updateStmt = db.prepare(
        `UPDATE giocatori SET squadra = $squadra,ruolo = $ruolo,quotazione = $quotazione,
        trequartista = $trequartista WHERE nome = $nome`,
      );
      const insertStmt = db.prepare(
        'INSERT INTO giocatori (nome, squadra, ruolo, quotazione, trequartista) VALUES(?,?,?,?,?)',
      );
      data.forEach(el => {
        if (
          !(
            typeof el === 'object' &&
            'Nome' in el &&
            'Ruolo' in el &&
            'Squadra' in el &&
            'Quotazione' in el &&
            'Trequartista' in el
          )
        ) {
          return reject('IL FILE CARICATO NON HA IL TEMPLATE CORRETTO.');
        }
      });

      for (const row of data) {
        const newRow = Object.fromEntries(
          Object.entries(row).map(([k, v]) => [k.toLowerCase(), v]),
        );
        const player = db.prepare('SELECT nome FROM giocatori WHERE nome = ?').get(newRow.nome);
        db.exec('BEGIN');
        if (player) {
          updateStmt.run({
            squadra: newRow.squadra,
            ruolo: newRow.ruolo,
            quotazione: newRow.quotazione,
            trequartista: newRow.trequartista,
            nome: newRow.nome,
          });
        } else {
          insertStmt.run(
            newRow.nome,
            newRow.squadra,
            newRow.ruolo,
            newRow.quotazione,
            newRow.trequartista,
          );
        }
        db.exec('COMMIT');
      }
      const rows = db.prepare('SELECT COUNT(nome) AS count FROM giocatori').get();

      resolve((rows as {count: number}).count);
    });
  };
  getPlayers = (name: string | null = null, fanta_squadra: number | null = null) => {
    return new Promise(resolve => {
      const stmt = `SELECT * FROM giocatori ${
        name
          ? `WHERE nome LIKE '%${name}%' AND squadra_fanta IS NULL LIMIT 10 `
          : fanta_squadra
          ? `WHERE squadra_fanta = ${fanta_squadra}`
          : ''
      }`;
      if (name == '' && fanta_squadra == null) resolve([]);

      const players = db.prepare(stmt).all();
      resolve(players);
    });
  };
  getTeamList = (team_id: number | null = null): Promise<teamInfo[]> => {
    return new Promise(resolve => {
      const stmt = `
    SELECT id,nome,finanze,tot_giocatori,tot_A,tot_C,tot_D,tot_P FROM squadre
    LEFT JOIN (SELECT count(giocatori.id) as tot_giocatori,squadra_fanta FROM giocatori GROUP BY giocatori.squadra_fanta)
      as rosa ON squadre.id = rosa.squadra_fanta
    LEFT JOIN (SELECT count(giocatori.id) as tot_A,squadra_fanta FROM giocatori WHERE ruolo = 'A' GROUP BY giocatori.squadra_fanta)
      as attaccanti ON squadre.id = attaccanti.squadra_fanta
    LEFT JOIN (SELECT count(giocatori.id) as tot_C,squadra_fanta FROM giocatori WHERE ruolo = 'C' GROUP BY giocatori.squadra_fanta)
      as centrocampisti ON squadre.id = centrocampisti.squadra_fanta
    LEFT JOIN (SELECT count(giocatori.id) as tot_D,squadra_fanta FROM giocatori WHERE ruolo = 'D' GROUP BY giocatori.squadra_fanta)
      as difensori ON squadre.id = difensori.squadra_fanta
    LEFT JOIN (SELECT count(giocatori.id) as tot_P,squadra_fanta FROM giocatori WHERE ruolo = 'P' GROUP BY giocatori.squadra_fanta)
      as portieri ON squadre.id = portieri.squadra_fanta
      ${team_id ? ' WHERE id=$team_id' : ''}
      `;
      const params = team_id ? {team_id: team_id} : [];
      let teams: teamInfo[];
      if (team_id) {
        teams = db.prepare(stmt).get(params) as teamInfo[];
      } else {
        teams = db.prepare(stmt).all(params) as teamInfo[];
      }
      resolve(teams);
    });
  };
  getRegole = (): Promise<regole> => {
    return new Promise(resolve => {
      let rules = db.prepare('SELECT * FROM regole LIMIT 1').get();
      if (!rules) {
        db.exec('BEGIN');
        db.prepare(
          'INSERT INTO regole(id,finanze_iniziali,max_rosa,max_atk,max_dc,max_cc,max_por) VALUES(1,50,0,0,0,0,0)',
        ).run();
        db.exec('COMMIT');
        rules = db.prepare('SELECT * FROM regole LIMIT 1').get();
      }
      resolve(rules as regole);
    });
  };
  updateRegole = (values: regole) => {
    return new Promise(resolve => {
      db.exec('BEGIN');
      db.prepare(
        'UPDATE regole SET finanze_iniziali = $finanze_iniziali, max_rosa=$max_rosa,max_atk=$max_atk,max_cc=$max_cc,max_dc=$max_dc,max_por=$max_por WHERE id=$id',
      ).run({
        id: values.id,
        finanze_iniziali: values.finanze_iniziali,
        max_atk: values.max_atk,
        max_rosa: values.max_rosa,
        max_cc: values.max_cc,
        max_dc: values.max_dc,
        max_por: values.max_por,
      });
      db.exec('COMMIT');
      resolve(true);
    });
  };
  removePlayer = (team_id: number, player_id: number, player_value: number) => {
    return new Promise(resolve => {
      db.exec('BEGIN');
      db.prepare('UPDATE giocatori SET squadra_fanta = NULL WHERE id = $player_id').run({
        player_id: player_id,
      });
      db.prepare('UPDATE squadre SET finanze = finanze + $quotazione WHERE id = $team_id').run({
        quotazione: player_value,
        team_id: team_id,
      });
      db.exec('COMMIT');
      resolve(true);
    });
  };
  deleteTeam = (team: teamInfo) => {
    return new Promise(resolve => {
      db.exec('BEGIN');
      db.prepare('DELETE FROM squadre WHERE id=?').run(team.id);
      db.exec('COMMIT');
      resolve(true);
    });
  };
}
