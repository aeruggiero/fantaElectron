import type {player, team, teamInfo, regole} from '../../interfaces';
import db from './dbmgr';
const {ipcRenderer} = require('electron');
export default class testmgr {
  getNames = () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM squadre', [], function (err: string, rows: team[]) {
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  };
  addName = (newName: string) => {
    const sql = `INSERT INTO squadre(nome) VALUES('${newName}')`;
    db.exec(sql, err => {
      if (err) {
        ipcRenderer.send('dialog', {
          message: 'Nome già presente',
          type: 'error',
          title: 'Nome già presente',
        });
      }
    });
  };
  addPlayerToTeam = async (player: player, team: teamInfo) => {
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
      }
      if (failed) return reject(message);
      if (player.quotazione > team.finanze) {
        return reject('Questa squadra non ha abbastanza soldi per effettuare l acquisto.');
      }
      if (regole.max_rosa <= team.tot_giocatori) {
        return reject('Questa squadra non ha più slot giocatori disponibili.');
      }
      db.run(
        'UPDATE giocatori SET squadra_fanta = $team_id WHERE id=$player_id',
        {
          $team_id: team.id,
          $player_id: player.id,
        },
        (err: string) => {
          if (err) {
            ipcRenderer.send('dialog', {
              message: 'Errore',
              type: 'error',
              title: 'Errore',
            });
            return reject(err);
          }

          db.run(
            'UPDATE squadre SET finanze=finanze - $playerValue WHERE id=$team_id',
            {$playerValue: player.quotazione, $team_id: team.id},
            (err: string) => {
              if (err) {
                return reject('Errore nell aggiornamento finanze');
              }
              return resolve('Giocatore aggiunto');
            },
          );
        },
      );
    });
  };
  addPlayers = (data: player[]) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.exec('DELETE FROM giocatori');
        const insertStmt = db.prepare(
          'INSERT INTO giocatori (nome, squadra, ruolo, quotazione, trequartista) VALUES(?,?,?,?,?)',
        );
        for (const row of data) {
          const newRow = Object.fromEntries(
            Object.entries(row).map(([k, v]) => [k.toLowerCase(), v]),
          );
          insertStmt.run(
            newRow.nome,
            newRow.squadra,
            newRow.ruolo,
            newRow.quotazione,
            newRow.trequartista,
          );
        }
        insertStmt.finalize();
        db.get(
          'SELECT COUNT(nome) AS count FROM giocatori',
          [],
          (err: string, row: {count: number}) => {
            if (err) {
              console.error(err);
              return reject(err);
            }
            resolve(row.count); // Resolve with the count of inserted rows
          },
        );
      });
    });
  };
  getPlayers = (name: string | null = null, fanta_squadra: number | null = null) => {
    return new Promise((resolve, reject) => {
      const stmt = `SELECT * FROM giocatori ${
        name
          ? `WHERE nome LIKE '%${name}%' AND squadra_fanta IS NULL LIMIT 10 `
          : fanta_squadra
          ? `WHERE squadra_fanta = ${fanta_squadra}`
          : ''
      }`;
      if (name == '' && fanta_squadra == null) resolve([]);
      db.all(stmt, [], (err: string | null, rows: player[] | []) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  };
  getTeamList = (team_id: number | null = null): Promise<teamInfo[]> => {
    return new Promise((resolve, reject) => {
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
      const params = team_id ? {$team_id: team_id} : [];
      db.all(stmt, params, (err: string, rows: teamInfo[]) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  };
  getRegole = (): Promise<regole> => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM regole', [], function (err: string, rows: regole) {
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve(rows);
      });
    });
  };
  updateRegole = (values: regole) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE regole SET finanze_iniziali = $finanze_iniziali, max_rosa=$max_rosa,max_atk=$max_atk,max_cc=$max_cc,max_dc=$max_dc,max_por=$max_por WHERE id=$id',
        {
          $id: values.id,
          $finanze_iniziali: values.finanze_iniziali,
          $max_atk: values.max_atk,
          $max_rosa: values.max_rosa,
          $max_cc: values.max_cc,
          $max_dc: values.max_dc,
          $max_por: values.max_por,
        },
        (err: string) => {
          if (err) return reject(err);
        },
      );
      resolve(true);
    });
  };
  removePlayer = (team_id: number, player_id: number, player_value: number) => {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE giocatori SET squadra_fanta = NULL WHERE id = $player_id',
        {$player_id: player_id},
        err => {
          if (err) {
            ipcRenderer.send('dialog', {
              message: 'Errore',
              type: 'error',
              title: 'Errore',
            });
            return reject(err);
          }
          db.run(
            'UPDATE squadre SET finanze = finanze + $quotazione WHERE id = $team_id',
            {$quotazione: player_value, $team_id: team_id},
            err => {
              if (err) {
                ipcRenderer.send('dialog', {
                  message: 'Errore',
                  type: 'error',
                  title: 'Errore',
                });
                return reject(err);
              }
              resolve(true);
            },
          );
        },
      );
    });
  };
}
