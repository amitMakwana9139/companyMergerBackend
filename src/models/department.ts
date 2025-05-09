import mongoose, { Schema, Document } from "mongoose";

interface IDepartment extends Document {
    name: string;
    companyId: string;
    userId: string;
    isActive: Number,
    isDeleted: Number
}

const departmentSchema: Schema = new Schema(
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

export default mongoose.model<IDepartment>("Department", departmentSchema);
