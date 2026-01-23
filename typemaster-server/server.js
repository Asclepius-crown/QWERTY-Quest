const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:3000', 'http://localhost:5173'].filter(Boolean),
  credentials: true
}));
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
}));
app.use(morgan('combined'));
app.use(express.json());

// DB Connection
// Forcing local connection to resolve Atlas timeout issues
const mongoURI = 'mongodb://127.0.0.1:27017/typemaster';

mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => {
    console.log('MongoDB Connection Error:', err);
  });

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));

// 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] Global Error: ${err.message}\nStack: ${err.stack}\n`);
  res.status(500).json({ error: err.message, stack: err.stack });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
