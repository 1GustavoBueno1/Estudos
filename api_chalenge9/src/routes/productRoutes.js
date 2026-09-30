const router = require('express').Router();
const ctrl = require('../controllers/productController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.patch('/:id', ctrl.updatePrice);

module.exports = router;
