const { Pool } = require('pg');
require('dotenv').config();

// Бұл жерде DATABASE_URL болса, соны қолданады (Render үшін), 
// болмаса жеке-жеке баптауларды қолданады (Localhost үшін).
const isProduction = process.env.NODE_ENV === 'production' || process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render-дегі Connection String
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'quikz',
  password: process.env.DB_PASSWORD || '1234', 
  port: process.env.DB_PORT || 5432,
  ssl: isProduction ? { rejectUnauthorized: false } : false // ӨТЕ МАҢЫЗДЫ ЖОЛ
});

module.exports = pool;