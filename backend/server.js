const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const  OpenAI  = require('openai');
const {check, validationResult} = require('express-validator');
const auth =require('./middleware/auth');
require('dotenv').config();


const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});


const SECRET_KEY = process.env.SECRET_KEY;
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

/**
 * @route POST api/register
 * @desc Register user
 */
app.post('/api/register', 
    [
        check('name', 'Please enter your name').not().isEmpty(),
        check('email', 'Please enter valid email').isEmail(),
        check(
        'password',
        'Please enter password of at least 6 characters'
        ).isLength({ min: 6 })
    ],
    async (req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({errors: "errors.array()"});
        }else{
            try{
                const {name, email, password} = req.body;

                const salt = await bcrypt.genSalt(10);
                let hashedPassword = await bcrypt.hash(password, salt);

                const result = await pool.query(
                    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
                    [name, email, hashedPassword]
                );
                res.status(201).json(result.rows[0]);
            }catch(error){
                res.status(500).json({ error: 'Error registering user' });
            }
    }
});

app.post('/api/login', 
    [
        check('email', 'Please enter valid email').isEmail(),
        check('password','Please enter password').exists()
    ],
    async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({errors: errors.array()});
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (!result.rows.length) {
            return res.status(400).json({ error: 'Invalid email' });
        }
        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in user' });
    }
});

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access denied.' });

    jwt.verify(token.split(' ')[1], SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token.' });
        req.user = user;
        next();
    });
};

/**
 * @route GET api/protected
 * @desc Auth user
 */
app.get('/api/protected', authenticateToken, (req, res) => {
    console.log('Protected route accessed:');
    res.json({ message: 'This is a protected route.'});
});



app.get('/', authenticateToken, (req, res) =>
    res.send('http get request sent to root api endpoint')
);











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

app.listen(5000, () => console.log('Server running on http://localhost:5000'));