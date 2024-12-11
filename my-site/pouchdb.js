// database/pouchdb.js
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));  // Plugin para las búsquedas
const db = new PouchDB('offlineRequests'); // Nombre de la base de datos local

module.exports = db;



