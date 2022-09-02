const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const exception = require('../exceptModels/_.models.loader');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares/authMiddle');

// 로그아웃(api/user/logout)
userRouter.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.status(200).json(new exception.FormDto('로그아웃 성공'));
});

// 회원탈퇴 (/api/user/signout)
userRouter.delete('/signout', isLoggedIn, userController.deleteUser);

module.exports = userRouter;
