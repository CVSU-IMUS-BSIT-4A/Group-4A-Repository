const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Open the database
const dbPath = path.join(__dirname, 'bookshelf.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    return;
  }
  console.log('Connected to SQLite database.');
});

// Sample data
const authors = [
  { name: 'J.K. Rowling', nationality: 'British', birthDate: '1965-07-31', biography: 'British author best known for the Harry Potter series' },
  { name: 'George R.R. Martin', nationality: 'American', birthDate: '1948-09-20', biography: 'American novelist and short story writer' },
  { name: 'Stephen King', nationality: 'American', birthDate: '1947-09-21', biography: 'American author of horror, supernatural fiction, suspense, and fantasy novels' },
  { name: 'Agatha Christie', nationality: 'British', birthDate: '1890-09-15', biography: 'English writer known for her detective novels' },
  { name: 'Isaac Asimov', nationality: 'American', birthDate: '1920-01-02', biography: 'American writer and professor of biochemistry' },
  { name: 'J.R.R. Tolkien', nationality: 'British', birthDate: '1892-01-03', biography: 'English writer, poet, philologist, and academic' },
  { name: 'Harper Lee', nationality: 'American', birthDate: '1926-04-28', biography: 'American novelist best known for To Kill a Mockingbird' },
  { name: 'Ernest Hemingway', nationality: 'American', birthDate: '1899-07-21', biography: 'American novelist, short story writer, and journalist' },
  { name: 'Jane Austen', nationality: 'British', birthDate: '1775-12-16', biography: 'English novelist known primarily for her six major novels' },
  { name: 'Charles Dickens', nationality: 'British', birthDate: '1812-02-07', biography: 'English writer and social critic' }
];

const categories = [
  { name: 'Fantasy', description: 'Fantasy fiction books with magical elements' },
  { name: 'Science Fiction', description: 'Science fiction novels exploring futuristic concepts' },
  { name: 'Horror', description: 'Horror fiction designed to frighten, unsettle, or scare' },
  { name: 'Mystery', description: 'Mystery novels featuring crime and detective work' },
  { name: 'Romance', description: 'Romance novels focusing on love and relationships' },
  { name: 'Classic Literature', description: 'Classic works of literature' },
  { name: 'Thriller', description: 'Thriller novels with suspense and excitement' },
  { name: 'Historical Fiction', description: 'Historical fiction set in the past' },
  { name: 'Biography', description: 'Biographical works about real people' },
  { name: 'Philosophy', description: 'Philosophical works and essays' }
];

const books = [
  // Fantasy
  { title: 'Harry Potter and the Philosopher\'s Stone', isbn: '978-0747532699', publicationYear: 1997, pageCount: 223, price: 12.99, authorId: 1, categoryId: 1 },
  { title: 'The Lord of the Rings', isbn: '978-0544003415', publicationYear: 1954, pageCount: 1216, price: 19.99, authorId: 6, categoryId: 1 },
  { title: 'A Game of Thrones', isbn: '978-0553103540', publicationYear: 1996, pageCount: 694, price: 15.99, authorId: 2, categoryId: 1 },
  { title: 'The Hobbit', isbn: '978-0547928227', publicationYear: 1937, pageCount: 310, price: 14.99, authorId: 6, categoryId: 1 },
  { title: 'The Chronicles of Narnia', isbn: '978-0064471190', publicationYear: 1950, pageCount: 767, price: 16.99, authorId: 6, categoryId: 1 },
  
  // Science Fiction
  { title: 'Foundation', isbn: '978-0553293357', publicationYear: 1951, pageCount: 244, price: 13.99, authorId: 5, categoryId: 2 },
  { title: 'Dune', isbn: '978-0441172719', publicationYear: 1965, pageCount: 688, price: 17.99, authorId: 5, categoryId: 2 },
  { title: '1984', isbn: '978-0451524935', publicationYear: 1949, pageCount: 328, price: 12.99, authorId: 5, categoryId: 2 },
  { title: 'The Martian', isbn: '978-0553418026', publicationYear: 2011, pageCount: 369, price: 15.99, authorId: 5, categoryId: 2 },
  { title: 'Ender\'s Game', isbn: '978-0812550702', publicationYear: 1985, pageCount: 324, price: 14.99, authorId: 5, categoryId: 2 },
  
  // Horror
  { title: 'The Shining', isbn: '978-0307743657', publicationYear: 1977, pageCount: 688, price: 16.99, authorId: 3, categoryId: 3 },
  { title: 'It', isbn: '978-1501142970', publicationYear: 1986, pageCount: 1138, price: 18.99, authorId: 3, categoryId: 3 },
  { title: 'The Exorcist', isbn: '978-0061007224', publicationYear: 1971, pageCount: 400, price: 13.99, authorId: 3, categoryId: 3 },
  { title: 'Dracula', isbn: '978-0486411095', publicationYear: 1897, pageCount: 488, price: 11.99, authorId: 3, categoryId: 3 },
  { title: 'Frankenstein', isbn: '978-0486282114', publicationYear: 1818, pageCount: 166, price: 10.99, authorId: 3, categoryId: 3 },
  
  // Mystery
  { title: 'Murder on the Orient Express', isbn: '978-0062693662', publicationYear: 1934, pageCount: 288, price: 12.99, authorId: 4, categoryId: 4 },
  { title: 'The Murder of Roger Ackroyd', isbn: '978-0062079998', publicationYear: 1926, pageCount: 288, price: 12.99, authorId: 4, categoryId: 4 },
  { title: 'And Then There Were None', isbn: '978-0062073485', publicationYear: 1939, pageCount: 272, price: 13.99, authorId: 4, categoryId: 4 },
  { title: 'The Big Sleep', isbn: '978-0394758282', publicationYear: 1939, pageCount: 231, price: 11.99, authorId: 4, categoryId: 4 },
  { title: 'Gone Girl', isbn: '978-0307588364', publicationYear: 2012, pageCount: 432, price: 15.99, authorId: 4, categoryId: 4 },
  
  // Romance
  { title: 'Pride and Prejudice', isbn: '978-0141439518', publicationYear: 1813, pageCount: 432, price: 12.99, authorId: 9, categoryId: 5 },
  { title: 'Jane Eyre', isbn: '978-0141441146', publicationYear: 1847, pageCount: 624, price: 13.99, authorId: 9, categoryId: 5 },
  { title: 'Wuthering Heights', isbn: '978-0141439556', publicationYear: 1847, pageCount: 464, price: 12.99, authorId: 9, categoryId: 5 },
  { title: 'The Notebook', isbn: '978-0446605231', publicationYear: 1996, pageCount: 214, price: 11.99, authorId: 9, categoryId: 5 },
  { title: 'Outlander', isbn: '978-0440212560', publicationYear: 1991, pageCount: 850, price: 16.99, authorId: 9, categoryId: 5 },
  
  // Classic Literature
  { title: 'To Kill a Mockingbird', isbn: '978-0061120084', publicationYear: 1960, pageCount: 281, price: 12.99, authorId: 7, categoryId: 6 },
  { title: 'The Great Gatsby', isbn: '978-0743273565', publicationYear: 1925, pageCount: 180, price: 11.99, authorId: 8, categoryId: 6 },
  { title: 'Moby Dick', isbn: '978-0142437247', publicationYear: 1851, pageCount: 625, price: 14.99, authorId: 8, categoryId: 6 },
  { title: 'War and Peace', isbn: '978-0143039990', publicationYear: 1869, pageCount: 1392, price: 19.99, authorId: 8, categoryId: 6 },
  { title: 'Anna Karenina', isbn: '978-0143035008', publicationYear: 1877, pageCount: 864, price: 16.99, authorId: 8, categoryId: 6 },
  
  // Thriller
  { title: 'The Girl with the Dragon Tattoo', isbn: '978-0307949486', publicationYear: 2005, pageCount: 465, price: 15.99, authorId: 8, categoryId: 7 },
  { title: 'Gone Girl', isbn: '978-0307588364', publicationYear: 2012, pageCount: 432, price: 15.99, authorId: 8, categoryId: 7 },
  { title: 'The Da Vinci Code', isbn: '978-0307474278', publicationYear: 2003, pageCount: 689, price: 16.99, authorId: 8, categoryId: 7 },
  { title: 'The Silence of the Lambs', isbn: '978-0312924584', publicationYear: 1988, pageCount: 338, price: 13.99, authorId: 8, categoryId: 7 },
  { title: 'The Bourne Identity', isbn: '978-0553278224', publicationYear: 1980, pageCount: 523, price: 14.99, authorId: 8, categoryId: 7 },
  
  // Historical Fiction
  { title: 'The Book Thief', isbn: '978-0375842207', publicationYear: 2005, pageCount: 552, price: 15.99, authorId: 8, categoryId: 8 },
  { title: 'All the Light We Cannot See', isbn: '978-1501173219', publicationYear: 2014, pageCount: 531, price: 16.99, authorId: 8, categoryId: 8 },
  { title: 'The Kite Runner', isbn: '978-1594631931', publicationYear: 2003, pageCount: 371, price: 14.99, authorId: 8, categoryId: 8 },
  { title: 'The Pillars of the Earth', isbn: '978-0451207149', publicationYear: 1989, pageCount: 973, price: 17.99, authorId: 8, categoryId: 8 },
  { title: 'Wolf Hall', isbn: '978-0312429980', publicationYear: 2009, pageCount: 604, price: 16.99, authorId: 8, categoryId: 8 },
  
  // Biography
  { title: 'Steve Jobs', isbn: '978-1451648539', publicationYear: 2011, pageCount: 656, price: 17.99, authorId: 8, categoryId: 9 },
  { title: 'Becoming', isbn: '978-1524763138', publicationYear: 2018, pageCount: 448, price: 18.99, authorId: 8, categoryId: 9 },
  { title: 'Long Walk to Freedom', isbn: '978-0316548182', publicationYear: 1994, pageCount: 656, price: 16.99, authorId: 8, categoryId: 9 },
  { title: 'The Diary of a Young Girl', isbn: '978-0553577129', publicationYear: 1947, pageCount: 283, price: 12.99, authorId: 8, categoryId: 9 },
  { title: 'I Know Why the Caged Bird Sings', isbn: '978-0345514400', publicationYear: 1969, pageCount: 289, price: 13.99, authorId: 8, categoryId: 9 },
  
  // Philosophy
  { title: 'Meditations', isbn: '978-0486298238', publicationYear: 180, pageCount: 256, price: 11.99, authorId: 8, categoryId: 10 },
  { title: 'The Republic', isbn: '978-0486411217', publicationYear: -380, pageCount: 416, price: 12.99, authorId: 8, categoryId: 10 },
  { title: 'Thus Spoke Zarathustra', isbn: '978-0140441185', publicationYear: 1883, pageCount: 352, price: 13.99, authorId: 8, categoryId: 10 },
  { title: 'The Art of War', isbn: '978-0486425573', publicationYear: -500, pageCount: 273, price: 10.99, authorId: 8, categoryId: 10 },
  { title: 'Critique of Pure Reason', isbn: '978-0486427560', publicationYear: 1781, pageCount: 480, price: 14.99, authorId: 8, categoryId: 10 }
];

// Function to insert data
const insertData = () => {
  let completed = 0;
  const total = authors.length + categories.length + books.length;

  // Insert authors
  authors.forEach((author, index) => {
    db.run(
      `INSERT OR IGNORE INTO author (name, nationality, birthDate, biography, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [author.name, author.nationality, author.birthDate, author.biography],
      function(err) {
        if (err) console.error('Error inserting author:', err);
        completed++;
        if (completed === total) {
          console.log('All data inserted successfully!');
          db.close();
        }
      }
    );
  });

  // Insert categories
  categories.forEach((category, index) => {
    db.run(
      `INSERT OR IGNORE INTO category (name, description, createdAt, updatedAt) 
       VALUES (?, ?, datetime('now'), datetime('now'))`,
      [category.name, category.description],
      function(err) {
        if (err) console.error('Error inserting category:', err);
        completed++;
        if (completed === total) {
          console.log('All data inserted successfully!');
          db.close();
        }
      }
    );
  });

  // Insert books
  books.forEach((book, index) => {
    db.run(
      `INSERT OR IGNORE INTO book (title, isbn, publicationYear, pageCount, price, isAvailable, authorId, categoryId, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [book.title, book.isbn, book.publicationYear, book.pageCount, book.price, true, book.authorId, book.categoryId],
      function(err) {
        if (err) console.error('Error inserting book:', err);
        completed++;
        if (completed === total) {
          console.log('All data inserted successfully!');
          db.close();
        }
      }
    );
  });
};

// Start inserting data
console.log('Starting to insert sample data...');
insertData();
