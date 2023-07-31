/**
 * @module preload
 */
import {ipcRenderer} from 'electron';
import queries from './dbmgr';

import * as XLSX from 'XLSX';
const testmgr = new queries();
export function openDialog(method: string, config: object) {
  return ipcRenderer.invoke('dialog', method, config);
}
// From render to
export {sha256sum} from './nodeCrypto';
export {versions} from './versions';
export {testmgr};
export {XLSX};
