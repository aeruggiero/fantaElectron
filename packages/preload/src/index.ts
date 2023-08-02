/**
 * @module preload
 */
import {ipcRenderer} from 'electron';
import queries from './dbmgr';
const XLSX = require('xlsx');
import type {player} from './interfaces';
import {writeFile} from 'xlsx';

const testmgr = new queries();
export function openDialog(method: string, config: object) {
  return ipcRenderer.invoke('dialog', method, config);
}
export function downloadTemplate() {
  console.log('ciao');
  const aoaData = [['Nome', 'Squadra', 'Ruolo', 'Quotazione', 'Trequartista']];
  const workSheet = XLSX.utils.aoa_to_sheet(aoaData);
  const workBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, 'Sheet 1');
  return workBook;
}
export async function uploadPlayers(file: {path: string}) {
  try {
    const workbook = XLSX.readFile(file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);
    await testmgr.addPlayers(data as player[]);
  } catch (error) {
    console.log(error);
  }
}
// From render to
export {sha256sum} from './nodeCrypto';
export {versions} from './versions';
export {testmgr};
export {XLSX};
export {writeFile};
