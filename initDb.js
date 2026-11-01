const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const dbPath = path.join(__dirname, "bookstore.db");

const initDatabase = async () => {
  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    console.log("Connected to SQLite database.");

    await db.exec(`
      CREATE TABLE IF NOT EXISTS book (
        id INTEGER PRIMARY KEY,
        title TEXT,
        author TEXT,
        price INTEGER,
        pages INTEGER
      );
    `);

    // Clear any existing rows to ensure exact 8 books
    await db.run("DELETE FROM book");

    const insertQuery = `
      INSERT INTO book (id, title, author, price, pages) VALUES
      (1, 'Atomic Habits', 'James Clear', 450, 320),
      (2, 'The Alchemist', 'Paulo Coelho', 300, 208),
      (3, 'Rich Dad Poor Dad', 'Robert Kiyosaki', 399, 336),
      (4, 'Wings of Fire', 'APJ Abdul Kalam', 250, 180),
      (5, 'Think and Grow Rich', 'Napoleon Hill', 350, 250),
      (6, 'Deep Work', 'Cal Newport', 499, 304),
      (7, 'Ikigai', 'Hector Garcia', 299, 194),
      (8, 'The Power of Habit', 'Charles Duhigg', 420, 371);
    `;

    await db.exec(insertQuery);

    const books = await db.all("SELECT * FROM book;");
    console.log("Books in database:");
    console.table(books);
    console.log(`Total records: ${books.length}`);
    await db.close();
  } catch (error) {
    console.error("Error initializing DB:", error);
    process.exit(1);
  }
};

initDatabase();
