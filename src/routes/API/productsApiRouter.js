const express = require('express');
const router = express.Router();
const productsApiController = require('../../controllers/API/productsApiController');

router.get('/', productsApiController.list)
router.get('/lastProduct', productsApiController.lastProduct)
router.get('/search', productsApiController.search)
router.get('/:id', productsApiController.detail)

module.exports = router;