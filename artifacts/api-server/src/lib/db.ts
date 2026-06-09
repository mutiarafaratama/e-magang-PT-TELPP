import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST || "helium",
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER || "postgres",
  database: process.env.PGDATABASE || "heliumdb",
  password: process.env.PGPASSWORD || undefined,
  ssl: false,
  max: 10,
  idleTimeoutMillis: 30000,
});

pool.on("error", (err) => {
  console.error("DB pool error:", err);
});

export default pool;
