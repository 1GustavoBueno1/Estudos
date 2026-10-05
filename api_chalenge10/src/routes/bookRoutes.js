const router = require('express').Router();
const ctrl = require('../controllers/bookController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);

module.exports = router;
