import * as sqlite3 from 'sqlite3';
/* const sqlite3 = require('sqlite3').verbose(); */
const db = new sqlite3.Database('./packages/database/src/fanta.db');
export default db;
