const { default: mongoose } = require("mongoose");

const MessageSchema = mongoose.Schema({
sender:{type:mongoose.Types.ObjectId,ref:"user"},
message:{type:String},
dateTime:{type:Number}
})

const RoomSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  messages: { type: [MessageSchema] ,default:[]},
});

const ConversationSchema = mongoose.Schema({
  title: { type: String, required: true },
  endpoint: { type: String, required: true },
  rooms: { type: [RoomSchema] , default:[] },
});


module.exports = {
    ConversationModel:mongoose.model("conversation" , ConversationSchema)
}