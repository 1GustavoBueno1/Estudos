const router = require('express').Router();
const ctrl = require('../controllers/loanController');

router.post('/', ctrl.create);
router.get('/:id', ctrl.get);
router.post('/:id/return', ctrl.giveBack);
router.post('/:id/renew', ctrl.renew);

module.exports = router;
