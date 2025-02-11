const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

const ensureTableExists = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_data (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Table 'user_data' ensured.");
  } catch (error) {
    console.error("❌ Error ensuring 'user_data' table:", error);
  }
};

// Connect to DB and create table
pool.connect()
  .then(async client => {
    console.log("✅ Connected to the database!");
    await ensureTableExists();
    client.release();
  })
  .catch(err => {
    console.error("❌ Database connection error:", err);
  });

module.exports = pool;

