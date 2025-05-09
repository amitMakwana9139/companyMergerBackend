import mongoose, { Schema, Document } from "mongoose";

interface ISubDepartment extends Document {
    name: string;
    companyId: string;
    departmentId: string;
    userId: string;
    isActive: Number,
    isDeleted: Number
}

const subDepartmentSchema: Schema = new Schema(
    {
        name: {
            type: String,
            default: "",
            required: true
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            default: "",
            required: true,
            ref: "Company"
        },
        departmentId: {
            type: mongoose.Schema.Types.ObjectId,
            default: "",
            required: true,
            ref: "Department"
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            default: "",
            required: true,
            ref: "User"
        },
        isActive: {                               // 0 - Not Active , 1 = Is Active
            type: Number,
            required: false,
            default: 0
        },
        isDeleted: {                              // 0 - Not Delete , 1 = Is Delete
            type: Number,
            required: false,
            default: 0
        }
    },
    { timestamps: true }
);

export default mongoose.model<ISubDepartment>("subDepartment", subDepartmentSchema);
