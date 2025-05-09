import mongoose, { Schema, Document } from "mongoose";

interface ICompany extends Document {
    _id: string;
    name: string;
    email: string;
    userId: string;
    merged_with: Array<string>;
    isActive: Number,
    isDeleted: Number
}

const companySchema: Schema = new Schema(
    {
        name: {
            type: String,
            default: "",
            required: true
        },
        email: {
            type: String,
            default: "",
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            default: "",
            required: true,
            ref: "User"
        },
        merged_with: {
            type: Array,
            default: null,
            required: false
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

export default mongoose.model<ICompany>("Company", companySchema);
