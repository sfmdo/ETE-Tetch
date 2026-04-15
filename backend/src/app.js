const express = require('express');
const cors = require('cors');
const productos = require('./routes/productos.routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/productos',productos);

module.exports = app;