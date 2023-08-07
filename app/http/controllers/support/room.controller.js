const Controller = require("../controller");
const { ConversationModel } = require("../../../models/conversation");
const { StatusCodes: HttpStatus } = require("http-status-codes");
const path = require("path");
const createHttpError = require("http-errors");

class RoomController extends Controller{
    async addRoom(req, res, next) {
        try {
          const { name,description,fileName,fileUploadPath ,namespace} = req.body;
          await this.findConversationWithEndpoint(namespace)
          await this.findRoomWithName(name)
          const image = path.join(fileUploadPath, fileName).replace(/\\/g, "/")
          const room = {name,description,image}
          const conversation = await ConversationModel.updateOne({endpoint:namespace },{
            $push:{rooms:room}
          });
    
          return res.status(HttpStatus.CREATED).json({
            statusCode: HttpStatus.CREATED,
            data: {
              message: "the name space has been created successfully",
            },
          });
        } catch (error) {
          next(error);
        }
      }
    
      async getListOfRooms(req, res, next) {
        try {
          const { title, endpoint } = req.body;
          const conversation = await ConversationModel.find({}, { rooms: 1 });
    
          return res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            data: {
              rooms:conversation.rooms,
            },
          });
        } catch (error) {
          next(error);
        }
      }
      async findRoomWithName(endpoint) {
        const conversation = await ConversationModel.findOne({ "rooms.name":endpoint });
        if (conversation)
          throw createHttpError.BadRequest("این اسم قبلا انتخاب شده است");
      }

      async findConversationWithEndpoint(endpoint) {
        const conversation = await ConversationModel.findOne({ endpoint });
        if (!conversation)
          throw createHttpError.BadRequest("فضای مکالمه ای یافت نشد");
          return conversation;
      }
}

module.exports = {
    RoomController: new RoomController()
}