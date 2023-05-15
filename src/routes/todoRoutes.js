const router = require('express').Router();
const todoController = require('../controllers/todo.controller');

router.get('/', todoController.getAll);
router.post('/', todoController.create);
router.get('/:id', todoController.getOne);
router.put('/status/:id', todoController.updateStatus);
router.put('/:id', todoController.update);
router.delete('/deleteall', todoController.deleteAll);
router.delete('/:id', todoController.deleteOne);

module.exports = router;