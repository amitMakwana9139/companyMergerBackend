import Joi from "joi";

// Common validation of pagination
export const commonPaginationValidation = Joi.object({
    page: Joi.number().required().min(1),
    limit: Joi.number().required().min(5),
    search: Joi.string().allow(""),
})

// Common validation of id
export const commonIdValidation = Joi.object({
    id: Joi.string().required(),
})

// Common validation of pagination with companyId
export const paginationWithCompanyValidation = Joi.object({
    page: Joi.number().required().min(1),
    limit: Joi.number().required().min(5),
    search: Joi.string().allow(""),
    companyId: Joi.string().required()
})

// Common validation of id
export const idWithCompanyValidation = Joi.object({
    id: Joi.string().required(),
    companyId: Joi.string().required()
})