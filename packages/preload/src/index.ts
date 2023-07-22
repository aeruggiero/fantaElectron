/**
 * @module preload
 */
import {ipcRenderer} from 'electron';
import queries from '../../database/src';

const XLSX = require('xlsx');
const testmgr = new queries();

export function openDialog(method: string, config: object) {
  return ipcRenderer.invoke('dialog', method, config);
}
// From render to
export {sha256sum} from './nodeCrypto';
export {versions} from './versions';
export {testmgr};
export {XLSX};
