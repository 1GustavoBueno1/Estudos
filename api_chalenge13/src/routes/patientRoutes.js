const router = require('express').Router();
const ctrl = require('../controllers/patientController');

router.get('/:id', ctrl.get);
router.post('/:id/pay', ctrl.pay);

module.exports = router;
