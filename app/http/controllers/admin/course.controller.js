const { CourseModel } = require("../../../models/course.model");
const { CopyObject, DeleteInvalidPropertyInObject, DeleteFileInPublic, GetVideosTotalTime } = require("../../../utils/functions");
const Controller = require("../controller");
const path = require("path");
const { CreateCourseSchema } = require("../../validators/admin/course.schema");
const createHttpError = require("http-errors");
const { default: mongoose } = require("mongoose");
const { StatusCodes: HttpStatus } = require("http-status-codes");

class CourseController extends Controller {
    async GetAllCourses(req, res, next) {
        try {
            const { search } = req.query;
            let courses;
            if (search) courses = await CourseModel
            .find({ $text: { $search: search } })
            .populate([
                { path: "category", select: { "category.children": 0, __v: 0, parent: 0 }},
                { path: "teacher", select: { first_name: 1, last_name: 1,
                mobile: 1, email: 1 }}
            ])
            .sort({ _id: -1 })
            else courses = await CourseModel
            .find({})
            .populate([
                { path: "category", select: { children: 0, __v: 0, parent: 0 }},
                { path: "teacher", select: { first_name: 1, last_name: 1,
                mobile: 1, email: 1 }}
            ])
            .sort({ _id: -1 })
            return res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                success: true,
                data: {
                    courses
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async AddCourse(req, res, next) {
        try {
            await CreateCourseSchema.validateAsync(req.body);
            const { fileUploadPath, fileName } = req.body;
            const image = path.join(fileUploadPath, fileName).replace(/\\/g, "/")
            const { title, short_text, text, tags, category, price, discount } = req.body;
            const teacher = req.user._id
            const course = await CourseModel.create({
                title,
                short_text,
                text, tags,
                category,
                price,
                discount,
                image,
                status: "Not Started",
                teacher
            })
            if (!course?._id) throw createHttpError.InternalServerError("Course was not added")
            return res.status(HttpStatus.CREATED).json({
                status: HttpStatus.CREATED,
                success: true,
                data: {
                    message: "Course was created successfully 🎉✨"
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async GetCourseById(req, res, next) {
        try {
            const { id } = req.params;
            const course = await CourseModel.findOne({ _id: id });
            course.time =  GetVideosTotalTime(course.chapters)
            if (!course) throw createHttpError.NotFound("No course was found with that Is")
            return res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                success: true,
                data: {
                    course
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async UpdateCourseById(req, res, next) {
        try {
            const { id } = req.params;
            const course = await this.FindCourseById(id);
            const data = CopyObject(req.body);
            const { fileUploadPath, fileName } = req.body;
            let blackList = ["time", "episodes", "chapters", "students", "likes", "bookmarks", "dislikes", "comments", "fileUploadPath", "fileName"]
            DeleteInvalidPropertyInObject(data, blackList);
            if (req.file) {
                data.image = path.join(req.get("host"),fileUploadPath, fileName).replace(/\\/gi, "/");
                DeleteFileInPublic(course.image)
            }
            const updateCourseResult = await CourseModel.updateOne(
                { _id: id },
                { $set: data }
            )
            if(updateCourseResult.modifiedCount == 0)
                throw createHttpError.InternalServerError("Course was Not Updated")

            return res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                success: true,
                data: {
                    message: "Course was updates successfully! 🔥✨🎉"
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async FindCourseById(id) {
        if (!mongoose.isValidObjectId(mongoose.Types.ObjectId(id))) throw createHttpError.BadRequest("Id is not correct")
        const course = await CourseModel.findOne({ _id: mongoose.Types.ObjectId(id) });
        if (!course) throw createHttpError.NotFound("No Course was found! ")
        return course;
    }
}

module.exports = {
    CourseController: new CourseController(),
}
