const e = require('express');
const authService = require("../services/auth.service");
const exception = require("../exceptModels/_.models.loader");


// 주석 달기 , auth router 연결

const localSignUp = async (req, res, next) => {
    const { email, nickname, password, confirmPw } = req.body;
    try {
        await joi
            .object({
                email: joi.string().email().min(8).max(30).trim().required(),
                nickname: joi.string().min(2).max(16).trim().required(), // 닉네임 정규식 , 닉네임 중복확인
                password: joi.number().min(8).max(20).trim().required(), // 비밀번호 정규식
                confirmPw: joi.number().trim().required(),
            })
            .validateAsync({
                email,
                nickname,
                password,
                confirmPw,
            });
        const signUp = await authService.localSignUp(
            email,
            nickname,
            password,
            confirmPw
        );
        return res.status(200).json({ signUp }); // 에러처리
    } catch (error) {
        console.error(error);
        next(err);
    }
};

const kakaoCallback = (req, res,next) => {
    passport.authenticate("kakao", {
        failureRedirect: "/", // kakaoStrategy에서 실패한다면 실행
    }),
    // kakaoStrategy에서 성공한다면 콜백 실행
    (req, res) => {
        console.log(req.user);

        res.redirect("/");
    }
}


// EM :8자~ 30자
// PW :영소대문자+숫자+특수문자 8자 ~ 20자
// NN : 한글, 영소 대문자. 숫자 2자~16자



/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const localLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        await authService.localLogin(
            email,
            password
        );

        return res.status(200).json(
            new exception.FormDto("로그인 성공")
        );
    } catch(err) {
        next(err);

    }
}

module.exports = { 
    localSignUp,
    localLogin
 };