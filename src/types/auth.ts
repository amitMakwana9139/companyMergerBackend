import { ObjectId } from "mongoose";

/* Structure of the data expected for user signup. */
export interface authCommon {
    name: string;
    email: string;
    password: string;
    company_action: string;
    company_name: string;
    existing_company_code: string;
    role: number;
    isActive?: number;
}

/*  Structure of the data when retrieving user profile details. */
export interface authDetails {
    _id: ObjectId,
    name: string;
    email: string;
    password: string;
    company_action: string;
    company_name: string;
    existing_company_code: string;
    isActive: number;
    isDeleted: number;
    role: number;
    token: string;
}
