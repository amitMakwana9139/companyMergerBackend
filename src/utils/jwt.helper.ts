import jwt from "jsonwebtoken";
import { authDetails } from "../types/auth";
import * as CryptoJS from 'crypto-js';
import { decryptData } from "./encryption";
import { NextFunction, Response } from "express";
import user from "../models/user";

// Generate JWT Token
export const authToken = async (obj: authDetails) => {
    try {
        const body = {
            _id: obj?._id?.toString(), // Convert ObjectId to string
            name: obj?.name,
            email: obj?.email,
            isActive: obj?.isActive,
            isDeleted: obj?.isDeleted,
            role: obj?.role
        };

        const secretKey = process.env.JWT_SECRET_KEY || "";
        const cryptoKey = process.env.CRYPTO_SECRET_KEY || "";
        const token = jwt.sign(body, secretKey, { expiresIn: "1d" });
        const encryptedData = CryptoJS.AES.encrypt(token, cryptoKey).toString();
        return encryptedData;
    } catch (error) {
        throw new Error("Internal server error!");
    }
}


// Verify user token
export const verifyAuthtoken = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const tokenCheck = req.headers.authorization;
    if (!tokenCheck || typeof tokenCheck !== "string") {
        res.status(500).json({ status: 500, success: false, message: "You are not authorized!", data: [{ isExpire: 1 }] });
        return;
    }
    const token = await decryptData(tokenCheck.replace("Bearer ", ""), String(process.env.CRYPTO_SECRET_KEY));
    jwt.verify(
        token.replace("Bearer ", ""),
        process.env.JWT_SECRET_KEY || "",
        async (err: any, userData: any) => {
            if (err) {
                res.status(200).json({ status: 401, success: false, message: "User is unAuthorized!" });
                return;
            } else {
                const getUser = await user.findById({ _id: userData._id })
                if (getUser) {
                    req.user = getUser;
                    next();
                }
                else {
                    res.status(200).json({ status: 401, success: false, message: "User not found!" });
                }
            }
        }
    );
};