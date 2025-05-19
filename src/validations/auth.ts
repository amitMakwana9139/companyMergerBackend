import Joi from "joi";

// User Signup validation
export const signupValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(4),
    company_action: Joi.string().required().valid("new_company", "existing_company"),
    company_name: Joi.string().optional(),
    existing_company_code: Joi.string().optional(),
    // role: Joi.number().required().valid(0, 1)
});

// User Login validation
export const loginValidation = Joi.object({
    email: Joi.string().email().required(),
    company_name: Joi.string().required(),
    password: Joi.string().required().min(4),
})

// Add Company validation
export const companyValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    merged_with: Joi.array().items(
        Joi.object({
            companyId: Joi.string().required(),
            isDelete: Joi.string().required()
        }).optional()
    ),
})

// Edit Company validation
export const editCompanyValidation = Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    email: Joi.string().email().required()
})

// Add Department validation
export const departmentValidation = Joi.object({
    name: Joi.string().required(),
    companyId: Joi.string().required()
})

// Edit Department validation
export const editDepartmentValidation = Joi.object({
    id: Joi.string().required(),
    companyId: Joi.string().required(),
    name: Joi.string().required()
})

// Add Sub Department validation
export const subDepartmentValidation = Joi.object({
    name: Joi.string().required(),
    departmentId: Joi.string().required(),
    companyId: Joi.string().required()
});

// Add synergies
export const synergiesValidation = Joi.object({
    name: Joi.string().required(),
    synergy_description: Joi.string().required(),
    strategy: Joi.string().required(),
    process_steps: Joi.array().required(),
    owner: Joi.string().required(),
    companyId: Joi.string().required(),
    claim_blame: Joi.array().items(
        Joi.object({
            claimed_by: Joi.string().required(),
            blamed_to: Joi.string().required(),
            comments: Joi.string().required()
        })
    ),
    system_requirements: Joi.array().items(
        Joi.object({
            title: Joi.string().required(),
            type: Joi.string().required(),
            priority: Joi.string().required(),
            assigned_team: Joi.string().required(),
        })
    ),
    execution_plan: Joi.array().items(
        Joi.object({
            phase: Joi.string().required(),
            weeks: Joi.string().required(),
            sr_titles: Joi.string().required(),
        })
    ),
    // userId: Joi.string().required()
});