import express from 'express';
import cors from 'cors';
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/complexes', async (req, res) => {
  const result = await pool.query('SELECT id, name, duration, type FROM complexes');
  res.json(result.rows);
});

app.get('/complexes/:id', async (req, res) => {
  const id = req.params.id;
  const complex = await pool.query('SELECT * FROM complexes WHERE id = $1', [id]);
  const exercises = await pool.query('SELECT * FROM exercises WHERE complex_id = $1', [id]);
  res.json({ ...complex.rows[0], exercises: exercises.rows });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running`);
});
