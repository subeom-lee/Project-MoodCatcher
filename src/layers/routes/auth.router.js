const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/auth.controller');
const passport = require('passport');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares/authMiddle');

// 회원가입(/api/auth/signup)
authRouter.post('/signup', isNotLoggedIn, authController.localSignUp);

// 이메일 확인(/api/auth/checkEmail?email)
authRouter.get('/checkEmail', isNotLoggedIn, authController.checkEmail);

// 닉네임 확인(/api/auth/checkNickname?nickname)
authRouter.get('/checkNickname', isNotLoggedIn, authController.checkNickname);

// 닉네임/나이/성별 추가(/api/auth/detail)
authRouter.post('/detail', isLoggedIn, authController.updateNicknameAgeGender);

// 로컬로그인(/api/auth/login)
authRouter.post('/login', isNotLoggedIn, authController.localLogin);

// 회원탈퇴 (/api/user/signout)
authRouter.delete('signout', authController.deleteUser);

//카카오 로그인(/api/auth/kakao)
authRouter.get('/kakao', isNotLoggedIn, passport.authenticate('kakao'));
//카카오 콜백(/api/auth/kakao/callback)
authRouter.get(
    '/kakao/callback',
    isNotLoggedIn,
    passport.authenticate('kakao', {
        failureRedirect: '/'
    }),
    authController.kakaoCallback
);
authRouter.get('/kakao/disconnect');

module.exports = authRouter;
