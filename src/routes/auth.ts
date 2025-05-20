import { Router } from "express";
import { validateRequest, validateRequestForQuery } from "../middlewares/validation";
import {
    companyValidation,
    departmentValidation,
    editCompanyValidation,
    editDepartmentValidation,
    loginValidation,
    signupValidation,
    subDepartmentValidation,
    synergiesEditValidation,
    synergiesValidation
} from "../validations/auth";
import {
    addSynergies,
    createCompany,
    createDepartment,
    createSubDepartment,
    deleteCompany,
    deleteDepartment,
    deleteSubDepartment,
    editCompany,
    editDepartment,
    editSubDepartment,
    editSynergies,
    getCompany,
    getCompanyStructure,
    getDepartment,
    getSubDepartment,
    getSynergies,
    removeSynergies,
    userLogin,
    userSignup
} from "../controllers/auth";
import { verifyAuthtoken } from "../utils/jwt.helper";
import { commonIdValidation, commonPaginationValidation, idWithCompanyValidation, paginationWithCompanyValidation } from "../validations/common";

const router = Router();

// Auth signup/login 
router.post("/signup", validateRequest(signupValidation), userSignup);
router.post("/login", validateRequest(loginValidation), userLogin);

// CRUD of company details by user
router.post("/createCompany", verifyAuthtoken, validateRequest(companyValidation), createCompany);
router.get("/getCompany", verifyAuthtoken, validateRequestForQuery(commonPaginationValidation), getCompany);
router.put("/editCompany", verifyAuthtoken, validateRequest(editCompanyValidation), editCompany);
router.delete("/removeCompany", verifyAuthtoken, validateRequestForQuery(commonIdValidation), deleteCompany)

// CRUD of department details by user
router.post("/createDepartment", verifyAuthtoken, validateRequest(departmentValidation), createDepartment);
router.get("/getDepartment", verifyAuthtoken, validateRequestForQuery(paginationWithCompanyValidation), getDepartment);
router.put("/editDepartment", verifyAuthtoken, validateRequest(editDepartmentValidation), editDepartment);
router.delete("/removeDepartment", verifyAuthtoken, validateRequestForQuery(commonIdValidation), deleteDepartment);

// CRUD of sub department details by user
router.post("/createSubDepartment", verifyAuthtoken, validateRequest(subDepartmentValidation), createSubDepartment);
router.get("/getSubDepartment", verifyAuthtoken, validateRequestForQuery(paginationWithCompanyValidation), getSubDepartment);
router.put("/editSubDepartment", verifyAuthtoken, validateRequest(editDepartmentValidation), editSubDepartment);
router.delete("/removeSubDepartment", verifyAuthtoken, validateRequestForQuery(idWithCompanyValidation), deleteSubDepartment);

// Get company tree structure
router.get("/getCompanyStructure", verifyAuthtoken, getCompanyStructure);

// Syenergies CRUD 
router.post("/addSynergies", verifyAuthtoken, validateRequest(synergiesValidation), addSynergies);
router.get("/getSynergies", verifyAuthtoken, validateRequestForQuery(commonPaginationValidation), getSynergies);
router.put("/editSynergies", verifyAuthtoken, validateRequest(synergiesEditValidation), editSynergies);
router.delete("/removeSynergies", verifyAuthtoken, validateRequestForQuery(commonIdValidation), removeSynergies);
export default router;  