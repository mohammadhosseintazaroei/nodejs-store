const boolean = require("@hapi/joi/lib/types/boolean")
const { Schema, Types, default: mongoose } = require("mongoose")

const AnswerSchema = new Schema({
    user: { type: Types.ObjectId, required: true, ref: "user" },
    comment: { type: String, required: true },
    show: { type: Boolean, required: true, default: false },
    openToComment: {type: Boolean, default:false}    
}, {
    timestamps: {
        createdAt: true
    }
})

const CommentSchema = new Schema({
    user : {type : mongoose.Types.ObjectId, ref: "user", required: true},
    comment: { type: String, required: true},
    createdAt: { type: Date, default: Date.now()},
    show: { type: Boolean, required:true,default:false},
    openToComment: { type: Boolean, required: true, default: true },
    answers: { type: [AnswerSchema],default:[]},
}, {
    timestamps: {
        createdAt: true
    }
})

module.exports = {
    CommentSchema,
}