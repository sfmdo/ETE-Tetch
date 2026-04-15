const express = require('express');
const router = express.Router();
const {getProducts} = require('../controller/productos.controller');

router.get('/',getProducts);

module.exports = router;
