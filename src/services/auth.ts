import user from "../models/user";
import { authCommon } from "../types/auth";

/* Find user profile details */
export const userProfile = async (body: authCommon) => {
    try {
        const isUserExist = await user.findOne({
            email: body.email,
            company_name: body.company_name,
        }).select({ email: 1, company_name: 1, password: 1 });
        return isUserExist;
    } catch (error) {
        throw new Error("Internal server error!");
    }
}

/* Find all user list */
export const findAllUSerList = async () => {
    try {
        const getAllUser = await user.find();
        return getAllUser;
    } catch (error) {
        throw new Error("Internal server error!");
    }
}