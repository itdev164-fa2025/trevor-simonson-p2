const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const  OpenAI  = require('openai');
require('dotenv').config();

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});


const SECRET_KEY = process.env.SECRET_KEY;
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

async function gptTest() {
    try{
        const response = await openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Say this is a test' }],
            model: 'gpt-4o-mini'
        });
        console.log(response.choices[0].message);
    }catch(error){
        console.log(error);
    }
}

gptTest();


async function getPgVersion() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT version()');
    console.log(result.rows[0]);
  } finally {
    client.release();
  }
}
getPgVersion();

app.listen(5000, () => console.log('Server running on http://localhost:5000'));