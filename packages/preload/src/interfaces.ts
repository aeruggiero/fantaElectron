export interface player {
  id: number;
  quotazione: number;
  ruolo: string;
  trequartista: string;
  squadra: string;
}
export interface teamInfo {
  id: number;
  nome: string;
  finanze: number;
  tot_giocatori: number;
  tot_A: number;
  tot_C: number;
  tot_D: number;
  tot_P: number;
}
export interface team {
  id: number;
  nome: string;
  finanze: number;
}
export interface regole {
  id: number;
  max_rosa: number;
  max_atk: number;
  max_dc: number;
  max_cc: number;
  max_por: number;
  finanze_iniziali: number;
}
