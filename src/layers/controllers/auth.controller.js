const e = require("express");
const authService = require("../services/auth.service");
const exception = require("../exceptModels/_.models.loader");
const joi = require("joi");

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const localSignUp = async (req, res, next) => {
    const { email, password, confirmPw } = req.body;
    try {
        await joi
            .object({
                email: joi.string().email().min(8).max(30).trim().required(),
                password: joi.string().trim().required(),
                confirmPw: joi.string().trim().required(),
            })
            .validateAsync({
                email,
                password,
                confirmPw,
            });
        const signUp = await authService.localSignUp(
            email,
            password,
            confirmPw
        );
        return res.status(201).json(new exception.FormDto("회원가입 성공"));
    } catch (err) {
        console.error(err);
        next(err);
    }
};
/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const createNicknameAgeGender = async (req, res, next) => {
    const userId = req.user.userId;
    // const userId = res.locals;
    const { nickname, age, gender } = req.body;
    try {
        await joi
            .object({
                nickname: joi.string().min(2).max(16).trim().required(),
                // age: joi.required(),
                // gender: joi.required(),
            })
            .validateAsync({
                nickname,
                // age,
                // gender,
            });
        const createNicknameAgeGender =
            await authService.createNicknameAgeGender(
                nickname,
                // age,
                // gender,
                userId
            );
        return res.status(200).json(
            new exception.FormDto("닉네임 나이 추가 성공", {
                createNicknameAgeGender,
            })
        );
    } catch (err) {
        console.error(err);
        next(err);
    }
};
/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const checkEmail = async (req, res, next) => {
    const { email } = req.query;
    try {
        await joi
            .object({
                email: joi.string().email().min(8).max(30).trim().required(),
            })
            .validateAsync({
                email,
            });
        await authService.checkEmail(email);
        return res.status(200).json(new exception.FormDto("이메일 확인 성공"));
    } catch (err) {
        console.error(err);
        next(err);
    }
};
/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const checkNickname = async (req, res, next) => {
    const { nickname } = req.query;
    try {
        await joi
            .object({
                nickname: joi.string().min(2).max(16).trim().required(), // 닉네임 정규식 , 닉네임 중복확인
            })
            .validateAsync({
                nickname,
            });
        await authService.checkNickname(nickname);
        return res.status(200).json(new exception.FormDto("닉네임 확인 성공"));
    } catch (err) {
        console.error(err);
        next(err);
    }
};

// EM :8자~ 30자
// PW :영소대문자+숫자+특수문자 8자 ~ 20자
// NN : 한글, 영소 대문자. 숫자 2자~16자

/** @param { e.Request } req @param { e.Response } res @param { e.NextFunction } next */
const localLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        await authService.localLogin(email, password);

        return res.status(200).json(new exception.FormDto("로그인 성공"));
    } catch (err) {
        next(err);
    }
};

module.exports = {
    localSignUp,
    createNicknameAgeGender,
    checkEmail,
    checkNickname,
    localLogin,
};
