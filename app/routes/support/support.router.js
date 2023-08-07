const { SupportController } = require("../../http/controllers/support/support.controller");
const { checkLogin, checkAccessLogin } = require("../../http/middlewares/auth");

const router = require("express").Router();

router.get("/login", checkAccessLogin,SupportController.LoginForm)
router.post("/login",checkAccessLogin ,SupportController.Login)
router.get("/", checkLogin, SupportController.RenderChatRoom)
module.exports = {
    SupportSectionRouter:router
}