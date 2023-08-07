const { NamespaceController } = require("../../http/controllers/support/namespace.controller");

const router = require("express").Router();

router.post("/add", NamespaceController.addNameSpace)
router.get("/list", NamespaceController.getListOfNameSpaces)
module.exports = {
    NamespaceSectionRouter:router
}