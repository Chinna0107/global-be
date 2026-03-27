require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "https://alurisglobaltrade.com"
    ],
    credentials: true,
  })
);


app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Global API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
