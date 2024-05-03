import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
  book: '++Title, author, year' // Primary key and indexed props
});