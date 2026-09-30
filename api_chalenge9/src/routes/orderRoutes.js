const router = require('express').Router();
const ctrl = require('../controllers/orderController');

router.post('/', ctrl.create);
router.get('/:id', ctrl.get);
router.patch('/:id/status', ctrl.changeStatus);
router.post('/:id/cancel', ctrl.cancel);

module.exports = router;
