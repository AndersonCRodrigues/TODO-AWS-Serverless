const express = require('express');
const serverless = require('serverless-http');
require('dotenv').config();
const todoRouter = require('./routes/todoRoutes');

const app = express();
app.use(express.json());

// routes

app.use('/user', todoRouter);

app.get('/', (req, res) => {
  res.send('Oi Ayslindo');
});

module.exports = {
  handler: serverless(app),
  app,
};