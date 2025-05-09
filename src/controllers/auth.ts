import { Request, Response, NextFunction } from "express"
import { userProfile } from "../services/auth"
import { authCommon, authDetails } from "../types/auth";
import user from "../models/user";
import { authToken } from "../utils/jwt.helper";
import { constant } from "../constant";
import { decryptData, encryptData } from "../utils/encryption";
import dotenv from "dotenv";
import company from "../models/company";
import department from "../models/department";
import subDepartment from "../models/subDepartment";
import mongoose from "mongoose";

dotenv.config();

/* Auth signup using Email with unique Email validation */
export const userSignup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        let body: authCommon = req.body;

        if (body && body.company_action === constant.new_company && !body.company_name) {
            res.status(502).json({ status: 502, success: false, message: "Company name is required!" });
            return
        } else {
            body.role = 0;
        }

        if (body && body.company_action === constant.existing_company_code && !body.existing_company_code) {
            res.status(400).json({ status: 400, success: false, message: "Company code is required!" });
            return
        }
        const isUserSignup = await userProfile(body);
        if (isUserSignup == null) {
            body.password = await encryptData(body.password, process.env.CRYPTO_SECRET_KEY || "");
            let response = await user.create(body);
            if (response) {
                res.status(200).json({ status: 200, success: true, message: "User signup succesfully." });
            } else {
                res.status(500).json({ status: 500, success: false, message: "Internal server error!" });
            }
        }
        else {
            res.status(200).json({ status: 409, success: false, message: "You are already registred please login!" });
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}

/* Auth login using Email with validation */
export const userLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body: authCommon = req.body;
        body.isActive = 1;
        let isUserExist = await userProfile(body) as (authDetails | null);
        isUserExist = JSON.parse(JSON.stringify(isUserExist));
        if (isUserExist !== null) {
            let decrypted = await decryptData(isUserExist.password, process.env.CRYPTO_SECRET_KEY || "");
            if (body.password !== decrypted) {
                res.status(401).json({ status: 401, success: false, message: "Invalid credentials!", data: {} });
                return;

            }
            else if (body.company_name !== isUserExist.company_name) {
                res.status(401).json({ status: 401, success: false, message: "Invalid credentials!", data: {} });
                return;
            }
            else {
                let response = await authToken(isUserExist);
                isUserExist.token = response;
                res.status(200).json({ status: 200, success: true, message: "User login succesfully.", data: isUserExist });
                return;
            }
        }
        else {
            res.status(200).json({ status: 502, success: false, message: "Please first signup!", data: [] });
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}

/* CRUD of company detail start
/* User add company data with validation */
export const createCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let body = req.body;
    try {
        const isCompanyExist = await company.findOne({ name: body.name, email: body.email }, { name: 1 }).lean()
        if (isCompanyExist === null) {
            body.userId = (req as any).user._id;
            const response = await company.create(body);
            if (response && Object.keys(response)?.length > 0) {
                res.status(200).json({ status: 200, success: true, message: "Compnay create succesfully!", data: {} });
                return;
            } else {
                res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
                return;
            }
        } else {
            res.status(200).json({ status: 409, success: false, message: "Company already exist!", data: {} });
            return;
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}

/* Get Company data */
export const getCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { page, limit, search } = req.query;
    try {
        const pageNumber: number = Number(page ?? 1);
        const pageLimit: number = Number(limit ?? 1);
        const skip: number = (pageNumber - 1) * pageLimit;

        const query: any = {
            userId: (req as any).user._id,
            isDeleted: 0
        };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } }, // Regex search for name
                { email: { $regex: search, $options: "i" } } // Regex search for email
            ];
        }

        const response = await company.find(query).limit(pageLimit).skip(skip).lean();
        const totalCount = await company.countDocuments(query);
        if (response && response?.length > 0) {
            res.status(200).json({ status: 200, success: true, message: "Company details find succesfully!", data: { data: response, count: totalCount, page: Math.ceil((totalCount / pageLimit)) } });
            return;
        } else {
            res.status(200).json({ status: 404, success: false, message: "Company details not found!", data: { data: [], count: 0, page: 0 } });
            return;
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}

export const editCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body;
    try {
        const response = await company.findByIdAndUpdate({ _id: body.id }, body);
        if (response && Object.keys(response).length > 0) {
            res.status(200).json({ status: 200, success: true, message: "Company details edit succesfully!", data: {} });
            return;
        } else {
            res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
            return;
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}

export const deleteCompany = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const response = await company.findOneAndUpdate({ _id: req.query.id, userId: (req as any).user._id }, { isDeleted: 1 });
        if (response && Object.keys(response).length > 0) {
            res.status(200).json({ status: 200, success: true, message: "Company details remove succesfully!", data: {} });
            return;
        } else {
            res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
            return;
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}
/* CRUD of company detail end


/* CRUD of Department detail start
/* User add department data with validation */
export const createDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let body = req.body;
    try {
        const isCompanyExist = await company.findById({ _id: body.companyId }, { _id: 1 }).lean();
        if (isCompanyExist === null) {
            res.status(404).json({ status: 404, success: false, message: "Company not found!", data: {} });
            return;
        }
        const isDepartmentExist = await department.findOne({ name: body.name, companyId: body.companyId }, { name: 1 }).lean()
        if (isDepartmentExist === null) {
            body.userId = (req as any).user._id;
            const response = await department.create(body);
            if (response && Object.keys(response)?.length > 0) {
                res.status(200).json({ status: 200, success: true, message: "Department create succesfully!", data: {} });
                return;
            } else {
                res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
                return;
            }
        } else {
            res.status(404).json({ status: 404, success: false, message: "Department already exist!", data: {} });
            return;
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}

export const getDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { page, limit, search, companyId } = req.query;
    try {
        const pageNumber: number = Number(page ?? 1);
        const pageLimit: number = Number(limit ?? 1);
        const skip: number = (pageNumber - 1) * pageLimit;

        const query: any = {
            userId: (req as any).user._id,
            isDeleted: 0,
            companyId: companyId
        };

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const response = await department.find(query).limit(pageLimit).skip(skip).lean();
        const totalCount = await department.countDocuments(query);
        if (response && response?.length > 0) {
            res.status(200).json({ status: 200, success: true, message: "Department details find succesfully!", data: { data: response, count: totalCount, page: Math.ceil((totalCount / pageLimit)) } });
            return;
        } else {
            res.status(200).json({ status: 404, success: false, message: "Department details not found!", data: { data: [], count: 0, page: 0 } });
            return;
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}

export const editDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body;
    try {
        const response = await department.findOneAndUpdate({ _id: body.id, companyId: body.companyId }, { name: body.name });
        if (response && Object.keys(response).length > 0) {
            res.status(200).json({ status: 200, success: true, message: "Department details edit succesfully!", data: {} });
            return;
        } else {
            res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
            return;
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}

export const deleteDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const response = await department.findOneAndUpdate({ _id: req.query.id, userId: (req as any).user._id }, { isDeleted: 1 });
        if (response && Object.keys(response).length > 0) {
            res.status(200).json({ status: 200, success: true, message: "Department details remove succesfully!", data: {} });
            return;
        } else {
            res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
            return;
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}
/* CRUD of Department detail end


/* CRUD of Sub Department detail start
/* User add department data with validation */
export const createSubDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let body = req.body;
    try {
        const isCompanyExist = await company.findById({ _id: body.companyId }, { _id: 1 }).lean();
        const isDepartmentExist = await department.findById({ _id: body.departmentId }, { _id: 1 }).lean()
        if (isCompanyExist === null) {
            res.status(404).json({ status: 404, success: false, message: "Company not found!", data: {} });
            return;
        }
        if (isDepartmentExist === null) {
            res.status(404).json({ status: 404, success: false, message: "Department not found!", data: {} });
            return;
        }
        const isSubDepartmentExist = await subDepartment.findOne({ name: body.name, companyId: body.companyId }, { name: 1 }).lean()
        if (isSubDepartmentExist === null) {
            body.userId = (req as any).user._id;
            const response = await subDepartment.create(body);
            if (response && Object.keys(response)?.length > 0) {
                res.status(200).json({ status: 200, success: true, message: "Sub Department create succesfully!", data: {} });
                return;
            } else {
                res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
                return;
            }
        } else {
            res.status(404).json({ status: 404, success: false, message: "Sub Department already exist!", data: {} });
            return;
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}

export const getSubDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { page, limit, search, companyId } = req.query;
    try {
        const pageNumber: number = Number(page ?? 1);
        const pageLimit: number = Number(limit ?? 1);
        const skip: number = (pageNumber - 1) * pageLimit;

        const query: any = {
            userId: (req as any).user._id,
            isDeleted: 0,
            companyId: companyId
        };

        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        const response = await subDepartment.find(query).limit(pageLimit).skip(skip).lean();
        const totalCount = await subDepartment.countDocuments(query);
        if (response && response?.length > 0) {
            res.status(200).json({ status: 200, success: true, message: "Sub Department details find succesfully!", data: { data: response, count: totalCount, page: Math.ceil((totalCount / pageLimit)) } });
            return;
        } else {
            res.status(200).json({ status: 404, success: false, message: "Sub Department details not found!", data: { data: [], count: 0, page: 0 } });
            return;
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}

export const editSubDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body;
    try {
        const response = await subDepartment.findOneAndUpdate({ _id: body.id, companyId: body.companyId }, { name: body.name });
        if (response && Object.keys(response).length > 0) {
            res.status(200).json({ status: 200, success: true, message: "Sub Department details edit succesfully!", data: {} });
            return;
        } else {
            res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
            return;
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}

export const deleteSubDepartment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const response = await subDepartment.findOneAndUpdate({
            _id: req.query.id,
            userId: (req as any).user._id,
            companyId: req.query.companyId
        },
            { isDeleted: 1 }
        );
        if (response && Object.keys(response).length > 0) {
            res.status(200).json({ status: 200, success: true, message: "Sub Department details remove succesfully!", data: {} });
            return;
        } else {
            res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
            return;
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}
/* CRUD of Department detail end


/* Get company structure  with validation */
export const getCompanyStructure = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // const getTreeStructure = await user.aggregate([
        //     {
        //         $match: {
        //             _id: new mongoose.Types.ObjectId((req as any).user._id)
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "companies",
        //             localField: "_id",
        //             foreignField: "userId",
        //             as: "companyDetails",
        //             pipeline: [
        //                 {
        //                     $project: {
        //                         _id: 1,
        //                         name: 1,
        //                         email: 1
        //                     }
        //                 }
        //             ]
        //         }
        //     },
        //     {
        //         $unwind: "$companyDetails"
        //     },
        //     {
        //         $lookup: {
        //             from: "departments",
        //             let: { companyId: "$companyDetails._id" },
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         $expr: { $eq: ["$companyId", "$$companyId"] }
        //                     }
        //                 },
        //                 {
        //                     $lookup: {
        //                         from: "subdepartments",
        //                         let: { departmentId: "$_id" },
        //                         pipeline: [
        //                             {
        //                                 $match: {
        //                                     $expr: { $eq: ["$departmentId", "$$departmentId"] }
        //                                 }
        //                             },
        //                             {
        //                                 $project: {
        //                                     _id: 1,
        //                                     name: 1,
        //                                 }
        //                             }
        //                         ],
        //                         as: "subDepartments"
        //                     },

        //                 },
        //                 {
        //                     $project: {
        //                         _id: 1,
        //                         name: 1,
        //                         subDepartments: 1
        //                     }
        //                 }
        //             ],
        //             as: "companyDetails.departments"
        //         }
        //     },
        //     {
        //         $group: {
        //             _id: "$_id",
        //             name: { $first: "$name" },
        //             email: { $first: "$email" },
        //             companyDetails: { $push: "$companyDetails" }
        //         }
        //     }
        // ]);
        const getTreeStructure = await user.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId((req as any).user._id)
                }
            },
            {
                $lookup: {
                    from: "companies",
                    localField: "_id",
                    foreignField: "userId",
                    as: "companyDetails",
                    pipeline: [
                        {
                            $match: { isDeleted: { $ne: 1 } } // Filter out deleted companies
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                email: 1
                            }
                        }
                    ]
                }
            },
            {
                $unwind: "$companyDetails"
            },
            {
                $lookup: {
                    from: "departments",
                    let: { companyId: "$companyDetails._id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$companyId", "$$companyId"] },
                                        { $ne: ["$isDeleted", 1] } // Filter out deleted departments
                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "subdepartments",
                                let: { departmentId: "$_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $and: [
                                                    { $eq: ["$departmentId", "$$departmentId"] },
                                                    { $ne: ["$isDeleted", 1] } // Filter out deleted subdepartments
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            name: 1
                                        }
                                    }
                                ],
                                as: "subDepartments"
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                subDepartments: 1
                            }
                        }
                    ],
                    as: "companyDetails.departments"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    name: { $first: "$name" },
                    email: { $first: "$email" },
                    companyDetails: { $push: "$companyDetails" }
                }
            }
        ]);

        if (getTreeStructure && getTreeStructure?.length > 0) {
            res.status(200).json({ status: 200, success: true, message: "Company tree structure get succesfully.", data: getTreeStructure });
            return;
        } else {
            res.status(200).json({ status: 404, success: true, message: "Company tree structure not found!", data: [] });
            return;
        }
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: "Internal server error!", data: {} });
        return;
    }
}