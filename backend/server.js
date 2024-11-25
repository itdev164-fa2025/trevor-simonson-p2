const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const OpenAI = require("openai");
const { check, validationResult } = require("express-validator");
const auth = require("./middleware/auth");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const SECRET_KEY = process.env.SECRET_KEY;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * @route POST api/register
 * @desc Register user
 */
app.post(
  "/api/register",
  [
    check("name", "Please enter your name").not().isEmpty(),
    check("email", "Please enter valid email").isEmail(),
    check(
      "password",
      "Please enter password of at least 6 characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: "errors.array()" });
    } else {
      try {
        const { name, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        let hashedPassword = await bcrypt.hash(password, salt);

        const result = await pool.query(
          "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
          [name, email, hashedPassword]
        );
        res.status(201).json(result.rows[0]);
      } catch (error) {
        res.status(500).json({ error: "Error registering user" });
      }
    }
  }
);

app.post(
  "/api/login",
  [
    check("email", "Please enter valid email").isEmail(),
    check("password", "Please enter password").exists(),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    try {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      if (!result.rows.length) {
        return res.status(400).json({ error: "Invalid email" });
      }
      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: "Invalid password" });
      }
      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: "1h" });
      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (error) {
      res.status(500).json({ error: "Error logging in user" });
    }
  }
);

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Access denied." });

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token." });
    req.user = user;
    next();
  });
};

/**
 * @route GET api/protected
 * @desc Auth user
 */
app.get("/api/protected", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    if (!result.rows.length) {
      return res.status(400).json({ error: "auth error" });
    }
    const user = result.rows[0];

    //const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Error logging in user" });
  }
});


/**
 * @route GET api/submit
 * @desc submit answers
 */
app.post("/api/submit", authenticateToken, async (req, res) => {
  try {
    const { user, results } = req.body;
    const userId = user.userId;
    const { aligned_thinker, summary, ...scores } = results;

    // Check if the thinker already exists in the database
    let thinker = await pool.query(
      "SELECT * FROM aligned_thinkers WHERE name = $1",
      [aligned_thinker.name]
    );

    // If thinker doesn't exist, insert them
    if (!thinker.rows.length) {
      thinker = await pool.query(
        "INSERT INTO aligned_thinkers (name, image_url, alignment_description) VALUES ($1, $2, $3) RETURNING id",
        [
          aligned_thinker.name,
          aligned_thinker.image_url,
          aligned_thinker.alignment_description,
        ]
      );
    }

    // Insert quiz results into the database
    const result = await pool.query(
      `INSERT INTO quiz_results 
      (user_id, autonomy_score, social_responsibility_score, environmental_consciousness_score, optimism_and_worldview_score, spirituality_and_transcendence_score, interpersonal_connection_score, summary, aligned_thinker_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, user_id`,
      [
        userId,
        Math.trunc(scores["Autonomy"] / 3),
        Math.trunc(scores["Social Responsibility"] / 3),
        Math.trunc(scores["Environmental Consciousness"] / 3),
        Math.trunc(scores["Optimism and Worldview"]/3),
        Math.trunc(scores["Spirituality and Transcendence"] / 3),
        Math.trunc(scores["Interpersonal Connection"] / 3),
        summary,
        thinker.rows[0].id,
      ]
    );

    res.json({
      results: { id: result.rows[0].id, userId: result.rows[0].user_id },
    });
  } catch (error) {
    console.error("Error saving results:", error);
    res.status(500).json({ error: "Error saving results" });
  }
});

// async function gptTest() {
//     try{
//         const response = await openai.chat.completions.create({
//             messages: [{ role: 'user', content: 'Say this is a test' }],
//             model: 'gpt-4o-mini'
//         });
//         console.log(response.choices[0].message);
//     }catch(error){
//         console.log(error);
//     }
// }

// gptTest();

// async function getPgVersion() {
//   const client = await pool.connect();
//   try {
//     const result = await client.query('SELECT version()');
//     console.log(result.rows[0]);
//   } finally {
//     client.release();
//   }
// }
// getPgVersion();

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
