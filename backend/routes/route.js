import express from "express";
import { addUser,getUsers,deleteUser,getDirectorSalary,addDirectorSalary,getDA_PercentData,ChangeDA_Percent,getUser,editUser,RegisterUser,SignInUser,getRegisterData,getStaffData,getDirectorSalarybyId} from '../controller/UserController.js';
import { SearchStaff } from "../controller/UserController.js";
import { getSalary } from "../controller/UserController.js";
import { generateResetToken, sendPasswordResetEmail, resetPassword } from '../controller/forgotPasswordController.js';

const router = express.Router();

// Generate reset token and send email to user
router.post('/forgot-password', generateResetToken, sendPasswordResetEmail);
// Verify reset token and reset user's password
router.post('/reset-password/:token', resetPassword);

router.post('/staffSalary/staffDash/:id',getSalary);
router.post('/signin',SignInUser);
router.post('/register',RegisterUser);
router.post('/DA_PersentData',ChangeDA_Percent);
router.post('/data-entry/:Id/:year', addUser);
router.post('/addDirectorSalary/:Id', addDirectorSalary);
router.get('/all/admin/:year/:month', getUsers);
router.get('/DirectorSalary/admin/:year/:month', getDirectorSalary);
router.get('/DirectorSalarybyId/:id/:year/:month', getDirectorSalarybyId);
router.get('/ViewData/:id/:year/:month', getUser);
router.get('/getRegisterData/:Id', getRegisterData);
router.get('/getDA_PercentData', getDA_PercentData);
router.get('/getStaffData/:Id/:Year', getStaffData);
// router.get('/:wing/:year/:month', fetchData);
router.put('/:id/:year/:month', editUser);
router.delete('/:named/:id/:month/:year', deleteUser);
router.delete('/:search', SearchStaff);
// router.post('/Student', getStudent);
export default router;
