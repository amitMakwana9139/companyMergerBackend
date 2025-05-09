import CryptoJS from "crypto-js";
import dotenv from "dotenv";

dotenv.config();

// Encrypt
export const encryptData = async (data: string, secretKey: string) => {
    try {
        var encryptedText = await CryptoJS.AES.encrypt(data, secretKey).toString();
        return encryptedText;
    } catch (error) {
        throw new Error("Internal server error!");
    }
}

// Decrypt
export const decryptData = async (data: string, secretKey: string) => {
    try {
        var decryptedText = await CryptoJS.AES.decrypt(data, secretKey).toString(CryptoJS.enc.Utf8);
        return decryptedText;
    } catch (error) {
        throw new Error("Internal server error!");
    }
}

// Generate random password
export const generateRandomPassword = async () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; // Allowed characters
    let password = "";

    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }

    return password;
}