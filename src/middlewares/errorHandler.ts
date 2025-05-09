import { Request, Response, NextFunction } from "express";

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err);  // Log the error for debugging

    // Send a consistent error response to the client
    res.status(500).json({
        success: false,
        message: err.message || "Something went wrong on the server"
    });
};
