const express = require("express")
const userController = require("./controlllers/user/user")

const router = express()

router.get('/users', userController.getUsers);
router.get('/user_by_id/:id', userController.getUserByID);
router.post('/users', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.put('/user/suspend/:id', userController.suspendUser);

module.exports = router