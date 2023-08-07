const { RoomController } = require("../../http/controllers/support/room.controller");
const { UploadFile } = require("../../utils/multer");

const router = require("express").Router();

router.post("/add",UploadFile.single("image"), RoomController.addRoom)
router.get("/list", RoomController.getListOfRooms)
module.exports = {
    RoomSectionRouter:router
}