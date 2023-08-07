const Controller = require("../controller");
const { ConversationModel } = require("../../../models/conversation");
const { StatusCodes: HttpStatus } = require("http-status-codes");

class MessageController extends Controller{

}

module.exports = {
    MessageController: new MessageController()
}