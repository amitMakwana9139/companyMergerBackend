import mongoose, { Schema, Document } from "mongoose";

interface ISynergies extends Document {
    name: string;
    synergy_description: string;
    strategy: string;
    process_steps: Array<string>;
    owner: string;
    companyId: string;
    claim_blame: Array<any>;
    system_requirements: Array<any>;
    execution_plan: Array<any>;
    userId: string;
    isActive: Number,
    isDeleted: Number
}

const synergiesSchema: Schema = new Schema(
    {
        name: {
            type: String,
            default: "",
            required: true
        },
        synergy_description: {
            type: String,
            default: "",
            required: true
        },
        strategy: {
            type: String,
            default: "",
            required: true
        },
        process_steps: {
            type: Array,
            default: [],
            required: true
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            default: "",
            required: true,
            ref: "User"
        },
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            default: "",
            required: false,
            ref: "Company"
        },
        claim_blame: [
            {
                claimed_by: { type: mongoose.Schema.Types.ObjectId, required: true, default: "", ref: "User" },
                blamed_to: { type: mongoose.Schema.Types.ObjectId, required: true, default: "", ref: "User" },
                comments: { type: String, required: true, default: "" },
            }
        ],
        system_requirements: [
            {
                title: { type: String, required: true, default: "" },
                type: { type: String, required: true, default: "" },
                priority: { type: String, required: true, default: "" },
                assigned_team: { type: String, required: true, default: "" }
            }
        ],
        execution_plan: [
            {
                phase: { type: String, required: true, default: "" },
                weeks: { type: String, required: true, default: "" },
                sr_titles: { type: String, required: true, default: "" },
            }
        ],
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            default: "",
            required: false,
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

export default mongoose.model<ISynergies>("synergies", synergiesSchema);
