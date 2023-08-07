

const { SupportSectionRouter } = require("./support.router");
const { NamespaceSectionRouter } = require("./namespace.router");
const { RoomSectionRouter } = require("./room.router");

const supportRouter = require("express").Router();

supportRouter.use("/", SupportSectionRouter);
supportRouter.use("/namespace", NamespaceSectionRouter );
supportRouter.use("/room", RoomSectionRouter);

module.exports = { supportRouter };
