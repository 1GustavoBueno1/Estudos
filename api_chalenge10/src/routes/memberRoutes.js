const router = require('express').Router();
const ctrl = require('../controllers/memberController');

router.get('/:id', ctrl.get);
router.post('/:id/pay-fines', ctrl.payFines);

module.exports = router;
