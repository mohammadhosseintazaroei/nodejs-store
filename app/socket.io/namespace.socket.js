const { ConversationModel } = require("../models/conversation");
const moment = require("moment-jalaali");
module.exports = class NamespaceSocketHandler {
  #io;
  constructor(io) {
    this.#io = io;
  }
  initConnection() {
    this.#io.on("connection", async (socket) => {
      const namespaces = await ConversationModel.find(
        {},
        { title: 1, endpoint: 1 }
      ).sort({ _id: -1 });
      socket.emit("namespacesList", namespaces);
    });
  }
  async creatNameSpacesConnection() {
    const namespaces = await ConversationModel.find(
      {},
      { rooms: 1, endpoint: 1 }
    ).sort({ _id: -1 });
    for (const namespace of namespaces) {
      this.#io.of(`/${namespace.endpoint}`).on("connection", async (socket) => {
        const conversation = await ConversationModel.findOne(
          { endpoint: namespace.endpoint },
          { rooms: 1, endpoint: 1 }
        ).sort({ _id: -1 });
        socket.emit("roomList", conversation.rooms);

        socket.on("joinRoom", async (roomName) => {
          const lastRoom = Array.from(socket.rooms)[1];
          if (lastRoom) {
            socket.leave(lastRoom);
            await this.getCountOfOnlineUsers(conversation.endpoint, lastRoom);
          }
          socket.join(roomName);
          await this.getCountOfOnlineUsers(conversation.endpoint, roomName);
          const roomInfo = conversation.rooms.find(
            (item) => item.name == roomName
          );
          socket.emit("roomInfo", roomInfo);
          this.getNewMessage(socket);
          socket.on("disconnect", async () => {
            await this.getCountOfOnlineUsers(conversation.endpoint, roomName);
          });
        });
      });
    }
  }
  async getCountOfOnlineUsers(endpoint, roomName) {
    const onlineUsers = await this.#io
      .of(`/${endpoint}`)
      .in(roomName)
      .allSockets();
    this.#io
      .of(`/${endpoint}`)
      .in(roomName)
      .emit("countOfOnlineUsers", Array.from(onlineUsers).length);
  }

  async getNewMessage(socket) {
    socket.on("newMessage", async (data) => {
      const { message, roomName, endpoint } = data;
      console.log("message")
      await ConversationModel.updateOne(
        { endpoint, "rooms.name": roomName },
        {
          $push: {
            "rooms.$.messages": {
              sender: "6300f18256baf017631b7f52",
              message,
              dateTime: Date.now(),
            },
          },
        }
      );
    });
  }
};
