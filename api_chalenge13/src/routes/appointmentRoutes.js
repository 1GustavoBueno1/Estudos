const router = require('express').Router();
const ctrl = require('../controllers/appointmentController');

router.post('/', ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.get);
router.post('/:id/cancel', ctrl.cancel);
router.post('/:id/reschedule', ctrl.reschedule);

module.exports = router;
