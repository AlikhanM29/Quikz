const express = require('express');
const cors = require('cors');
const pool = require('./db'); // db.js файлымен байланыс
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- 1. ТЕСТТЕРДІ АЛУ (READ) ---
app.get('/api/quizzes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT q.id, q.title, 
      json_agg(json_build_object(
        'question', qs.question_text, 
        'options', qs.options, 
        'correct', qs.correct_answer
      )) as questions
      FROM quizzes q
      LEFT JOIN questions qs ON q.id = qs.quiz_id
      GROUP BY q.id
      ORDER BY q.id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Деректерді алу мүмкін болмады" });
  }
});

// --- 2. ЖАҢА ТЕСТ ҚОСУ (CREATE) ---
app.post('/api/quizzes', async (req, res) => {
  const { title, questions } = req.body;
  try {
    // Транзакция бастау
    await pool.query('BEGIN');
    
    const newQuiz = await pool.query(
      "INSERT INTO quizzes (title) VALUES ($1) RETURNING id",
      [title]
    );
    const quizId = newQuiz.rows[0].id;

    for (let q of questions) {
      await pool.query(
        "INSERT INTO questions (quiz_id, question_text, options, correct_answer) VALUES ($1, $2, $3, $4)",
        [quizId, q.question, q.options, q.correct]
      );
    }
    
    await pool.query('COMMIT');
    res.json({ success: true, message: "Тест сәтті сақталды!" });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err.message);
    res.status(500).json({ error: "Сақтау кезінде қате кетті" });
  }
});

// --- 3. ТЕСТТІ ӨШІРУ (DELETE) ---
app.delete('/api/quizzes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM quizzes WHERE id = $1", [id]);
    res.json({ message: "Тест өшірілді" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Өшіру мүмкін болмады" });
  }
});

// --- 4. ОҚУШЫ НӘТИЖЕСІН САҚТАУ ---
app.post('/api/results', async (req, res) => {
  const { name, test, score, total, date } = req.body;
  const hasValidPayload =
    typeof name === 'string' &&
    name.trim() &&
    typeof test === 'string' &&
    test.trim() &&
    Number.isFinite(Number(score)) &&
    Number.isFinite(Number(total)) &&
    typeof date === 'string' &&
    date.trim();

  if (!hasValidPayload) {
    return res.status(400).json({ error: "Invalid result payload" });
  }

  try {
    const newResult = await pool.query(
      "INSERT INTO results (student_name, test_title, score, total, test_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name.trim(), test.trim(), Number(score), Number(total), date.trim()]
    );
    res.json(newResult.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Нәтижені сақтау қатесі" });
  }
});

// --- 5. БАРЛЫҚ НӘТИЖЕЛЕРДІ АЛУ (Статистика үшін) ---
app.get('/api/results', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM results
      WHERE student_name IS NOT NULL
        AND test_title IS NOT NULL
        AND score IS NOT NULL
        AND total IS NOT NULL
      ORDER BY id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Статистиканы алу қатесі" });
  }
});

// --- ЖАҢАДАН ҚОСЫЛҒАН: ҚОЛДАНУШЫЛАРДЫ БАСҚАРУ ---

// 6. Қолданушыларды тіркеу (Register)
app.post('/api/users', async (req, res) => {
  const { name, email, password, role, phone, groupOrSubject } = req.body;
  try {
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role, phone, group_subject) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, email, password, role, phone, groupOrSubject]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error("Тіркеу қатесі:", err.message);
    res.status(500).json({ error: "Қолданушыны тіркеу мүмкін болмады" });
  }
});

// 7. Қолданушылар тізімін алу (Login тексеру үшін қажет болуы мүмкін)
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Қолданушыларды алу мүмкін болмады" });
  }
});

// Серверді іске қосу
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер ${PORT} портында жұмыс істеп тұр`);
});
