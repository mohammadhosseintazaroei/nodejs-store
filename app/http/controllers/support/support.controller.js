const { UserModel } = require("../../../models/user.model");
const { COOKIE_PARSER_SECRET_KEY } = require("../../../utils/constants");
const { SignAccessToken } = require("../../../utils/functions");
const Controller = require("../controller");

class SupportController extends Controller {
  RenderChatRoom(req, res, next) {
    try {
      return res.render("chat.ejs");
    } catch (error) {
      next(error);
    }
  }
  LoginForm(req, res, next) {
    try {
      return res.render("login.ejs", {
        error: undefined,
      });
    } catch (error) {
      next(error);
    }
  }
  async Login(req, res, next) {
    try {
      const { mobile } = req.body;
      const user = await UserModel.findOne({ mobile });
      if (!user)
        return res.render("login.ejs", {
          error: "حساب کاربری بااین شماره موبایل یافت نشد",
        });
      const token = await SignAccessToken(user);
      user.token = token;
      user.save();
      res.cookie("authorization", token, {
        signed: true,
      });
      return res.redirect("/support");
    } catch (error) {
      next(error);
    }
  }
}

module.exports = {
  SupportController: new SupportController(),
};
