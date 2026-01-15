const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./task.db');

console.log('Database Tables and Structure:\n');

const tables = ['user', 'project', 'task'];

tables.forEach(tableName => {
  db.all(`PRAGMA table_info(${tableName})`, [], (err, columns) => {
    if (err) {
      console.error(`Error getting ${tableName} structure:`, err);
    } else {
      console.log(`Table: ${tableName}`);
      console.log('Columns:');
      columns.forEach(col => {
        console.log(`  - ${col.name}: ${col.type}${col.notnull ? ' (NOT NULL)' : ''}${col.pk ? ' (PRIMARY KEY)' : ''}${col.dflt_value ? ` DEFAULT ${col.dflt_value}` : ''}`);
      });
      console.log('');
    }
  });
});