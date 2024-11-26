const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const OpenAI = require("openai");
const { check, validationResult } = require("express-validator");
const auth = require("./middleware/auth");
require("dotenv").config();
const questions = [
  {
    id: "1",
    question:
      "I believe individuals should have the freedom to make their own choices without interference.",
    scale: [1, 2, 3, 4, 5],
    area: "Personal Autonomy",
  },
  {
    id: "2",
    question:
      "I think that personal success is primarily determined by one's actions and choices.",
    scale: [1, 2, 3, 4, 5],
    area: "Personal Autonomy",
  },
  {
    id: "3",
    question:
      "I value self-discipline and personal growth as core to my life philosophy.",
    scale: [1, 2, 3, 4, 5],
    area: "Personal Autonomy",
  },
  {
    id: "4",
    question: "I feel it is my duty to help those less fortunate than myself.",
    scale: [1, 2, 3, 4, 5],
    area: "Social Responsibility",
  },
  {
    id: "5",
    question:
      "I believe that society has a responsibility to ensure basic rights and needs are met for all.",
    scale: [1, 2, 3, 4, 5],
    area: "Social Responsibility",
  },
  {
    id: "6",
    question:
      "I think that individual actions can contribute to positive social change.",
    scale: [1, 2, 3, 4, 5],
    area: "Social Responsibility",
  },
  {
    id: "7",
    question: "I believe humans have a moral duty to protect the environment.",
    scale: [1, 2, 3, 4, 5],
    area: "Environmental Consciousness",
  },
  {
    id: "8",
    question: "I try to make choices that minimize my environmental impact.",
    scale: [1, 2, 3, 4, 5],
    area: "Environmental Consciousness",
  },
  {
    id: "9",
    question:
      "I think that future generations have a right to a healthy and sustainable planet.",
    scale: [1, 2, 3, 4, 5],
    area: "Environmental Consciousness",
  },
  {
    id: "10",
    question:
      "I believe that humanity is generally progressing towards a better future.",
    scale: [1, 2, 3, 4, 5],
    area: "Optimism and Worldview",
  },
  {
    id: "11",
    question:
      "I try to see the positive side of situations, even when things go wrong.",
    scale: [1, 2, 3, 4, 5],
    area: "Optimism and Worldview",
  },
  {
    id: "12",
    question:
      "I believe that people are fundamentally good and capable of positive change.",
    scale: [1, 2, 3, 4, 5],
    area: "Optimism and Worldview",
  },
  {
    id: "13",
    question:
      "I believe there is a spiritual or transcendent dimension to life.",
    scale: [1, 2, 3, 4, 5],
    area: "Spirituality and Transcendence",
  },
  {
    id: "14",
    question:
      "I feel connected to something larger than myself, whether spiritual, universal, or natural.",
    scale: [1, 2, 3, 4, 5],
    area: "Spirituality and Transcendence",
  },
  {
    id: "15",
    question:
      "I find meaning and purpose in practices or beliefs beyond the physical world.",
    scale: [1, 2, 3, 4, 5],
    area: "Spirituality and Transcendence",
  },
  {
    id: "16",
    question:
      "I believe that close personal relationships are essential to a fulfilling life.",
    scale: [1, 2, 3, 4, 5],
    area: "Interpersonal Connection",
  },
  {
    id: "17",
    question:
      "I think that empathy and understanding are key to building strong relationships.",
    scale: [1, 2, 3, 4, 5],
    area: "Interpersonal Connection",
  },
  {
    id: "18",
    question: "I feel that my connections with others shape who I am.",
    scale: [1, 2, 3, 4, 5],
    area: "Interpersonal Connection",
  },
];
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

const saveResults = async (user, results) => {
    try {
    //const { user, results } = req.body;
    const userId = user;
    const { aligned_thinker, summary, ...scores } = results;
      console.log(results);

    let thinker = await pool.query(
      "SELECT * FROM aligned_thinkers WHERE name = $1",
      [aligned_thinker.name]
    );


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

    // res.json({
    //   results: { id: result.rows[0].id, userId: result.rows[0].user_id },
    // });
  } catch (error) {
    console.error("Error saving results:", error);
    //res.status(500).json({ error: "Error saving results" });
  }
}

/**
 * @route POST api/submit
 * @desc submit answers
 */
app.post("/api/submit", authenticateToken, async (req, res) => {
    const { user, answers } = req.body;
    console.log(questions);
    const payload = {
      model: "gpt-3.5-turbo", // Use 'gpt-4' if needed
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant. When provided with a JSON of answers, check them against these questions: ${questions}, and score each question from 1 to 5 based on each area tested. create a summary of the users philosophy and values.
          then find a like minded philosopher or thinker and provide a name, working image url, and summary of that persons beliefs.
          
          Return the results in the following json schema only:
        {
          "Autonomy": int,
          "Social Responsibility": int,
          "Environmental Consciousness": int,
          "Optimism and Worldview": int,
          "Spirituality and Transcendence": int,
          "Interpersonal Connection": int,
          "summary": str,
          "aligned_thinker": {
            "name": str,
            "image_url": str,
            "alignment_description": str
          }
        }`,
        },
        {
          role: "user",
          content: `Here is the JSON of answers: ${JSON.stringify(answers)}`,
        },
      ],
      temperature: 0.7,
    };

      try{
          const response = await openai.chat.completions.create(payload);
          res.json({
            results: response.choices[0].message.content,
          });
          const responseContent = JSON.parse(response.choices[0].message.content);
          await saveResults(user, responseContent);
          console.log(response.choices[0].message.content);
      }catch(error){
          console.log(error);
      }

});

app.get("/api/results/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    // Query to retrieve user results and associated thinker details
    const resultQuery = `
        SELECT 
          qr.id AS result_id,
          qr.user_id,
          qr.autonomy_score,
          qr.social_responsibility_score,
          qr.environmental_consciousness_score,
          qr.optimism_and_worldview_score,
          qr.spirituality_and_transcendence_score,
          qr.interpersonal_connection_score,
          qr.summary,
          at.name AS thinker_name,
          at.image_url AS thinker_image_url,
          at.alignment_description AS thinker_description
        FROM quiz_results qr
        LEFT JOIN aligned_thinkers at ON qr.aligned_thinker_id = at.id
        WHERE qr.user_id = $1
        ORDER BY qr.id DESC
        LIMIT 1; 
      `;

    const results = await pool.query(resultQuery, [userId]);

    if (results.rows.length === 0) {
      return res.status(404).json({ error: "Results not found" });
    }

    res.json(results.rows[0]); // Return the result
  } catch (error) {
    console.error("Error retrieving user results:", error);
    res.status(500).json({ error: "Failed to retrieve user results" });
  }
});



app.listen(5000, () => console.log("Server running on http://localhost:5000"));
