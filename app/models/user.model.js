const { Schema, Types, model } = require("mongoose");

const ProductSchema = new Schema({
    productID:{type:Types.ObjectId,ref:"product"},
    count:{type:Number,default:1},
})

const CourseSchema = new Schema({
    courseID:{type:Types.ObjectId,ref:"course"},
    count:{type:Number,default:1},
})

const BasketSchema = new Schema({
    courses:{type:[CourseSchema] , default:[]},
    products:{type:[ProductSchema] , default:[]},
})
const UserSchema = new Schema({ 
    first_name : { type : String },
    last_name : { type : String },
    username : { type : String, lowercase : true },
    mobile : { type : String, required : true },
    email : { type : String, lowercase : true },
    password : { type : String },
    otp : { type : Object, default : {
        code : 0,
        expiresIn : 0
    }},
    bills : { type : [], default : [] },
    discount : { type : Number, default : 0 },
    birthday : { type : String },
    Role : { type : String, default : "USER", ref: "permissions" },
    Courses: { type: [ Types.ObjectId ], ref: "course", default: [] },
    basket:{type:BasketSchema}
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    }
})

UserSchema.index({ mobile: "text", username: "text", first_name: "text", last_name: "text" })

module.exports = {
    UserModel: model("user", UserSchema)
}