const router = require("express").Router();
const { UserController } = require("../../http/controllers/user/user.controller");
const { PermissionGuard } = require("../../http/middlewares/Permission.guard");
const { PERMISSIONS } = require("../../utils/constants");
const { UploadFile } = require("../../utils/multer");

router.post("/add", PermissionGuard([PERMISSIONS.ADMIN]),UploadFile.single("image"), UserController.CreateUser)
router.get("/all", PermissionGuard([PERMISSIONS.ADMIN]), UserController.GetAllUsers)
router.get("/:id", PermissionGuard([PERMISSIONS.ADMIN]), UserController.GetUserById)
router.patch("/update-profile", PermissionGuard([]),UploadFile.single("image"), UserController.UpdateUserProfile)
router.patch("/update/:id", PermissionGuard([]),UploadFile.single("image"), UserController.UpdateUser)
router.delete("/remove/:id", PermissionGuard([PERMISSIONS.ADMIN]), UserController.RemoveUser)
router.get("/profile", PermissionGuard([]), UserController.UserProfile)

module.exports = {
    AdminUsersRoutes: router,
}
