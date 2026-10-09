const router = require('express').Router();
const ctrl = require('../controllers/doctorController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.get('/:id/slots', ctrl.slots);

module.exports = router;
