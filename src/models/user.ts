import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    company_action: string;
    company_name: string;
    existing_company_code: string;
    isActive: Number,
    isDeleted: Number,
    role: Number;
}

const UserSchema: Schema = new Schema(
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
        password: {
            type: String,
            default: "",
            required: true
        },
        company_action: {
            type: String,
            required: true
        },
        company_name: {
            type: String,
            default: "",
            required: false
        },
        existing_company_code: {
            type: String,
            default: "",
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
        },
        role: {
            type: Number,                        // 0 - Admin 
            default: 0,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
