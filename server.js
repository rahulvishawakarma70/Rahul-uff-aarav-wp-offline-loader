const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express(); // <-- you forgot this line

// middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// simple test route
app.get('/', (req, res) => {
  res.send('Server is running ✅');
});

// Render needs to use process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
