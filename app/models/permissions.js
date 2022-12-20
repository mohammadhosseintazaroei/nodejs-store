const { Schema, model } = require("mongoose");

const PermissionSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, default: "" }
}, {
    toJSON: {
        virtuals: true
    }
})

PermissionSchema.index({ title: "text" })

module.exports = {
    PermissionModel : model("permissions", PermissionSchema)
}
