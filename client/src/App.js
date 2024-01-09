import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import YearSelection from "./component/YearSelection";
import MonthSelection from "./component/MonthSelection";
import DataEntry from "./component/DataEntry";
import AllData from "./component/AllData";
import Home from "./component/Home";
import EditStaff from "./component/EditStaff";
import Staff from "./component/Staff";
import AdminDash from "./component/AdminDash";
import ViewData from "./component/ViewData";
import Register from "./component/Register";
import SignIn from "./component/SignIn";
import StaffDash from "./component/StaffDash";
import StaffSalary from "./component/StaffSalary";
import PasswordResetPage from './component/PasswordResetPage';
import GetRegisterData  from "./component/GetRegisterData";
import StaffData from "./component/StaffData";
import DA_PersentData from "./component/DA_PersentData";
import DirectorPayable from "./component/DirectorPayable";
import GetDirectorDetails from "./component/GetDirectorDetails";
import DirectorDataTable from "./component/DirectorDatatable";
import AllMemberComponent from "./component/AllMemberComponent";
const App = () => {
  return (
    <>
    <Router>
      <Routes>
      <Route path="/reset-password" element={<PasswordResetPage />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/DirectorDataTable/:year/:month" element={<DirectorDataTable/>} />
        <Route path="/DA_PersentData" element={<DA_PersentData></DA_PersentData>} />
        <Route path="/signin" element={<SignIn/>} />
        <Route path="/admin/:year/:month" element={<AdminDash/>} />
        <Route path="/" element={<Home/>} />
        <Route path="/year" element={<YearSelection/>} />
        <Route path="/staffDash/:id" element={<StaffDash/>} />
        <Route path="/staffSalary/staffDash/:id" element={<StaffSalary/>} />
        <Route path="/all/admin/:year/:month" element={<AllData/>} />
        <Route path="/AllMemberComponent/admin/:year/:month" element={<AllMemberComponent/>} />
        <Route path="/searchStaff/admin/:year/:month" element={<Staff/>} />
        <Route path="/edit/:name/:id/:year/:month" element={<EditStaff/>} />
        <Route path="/months/:year" element={<MonthSelection />} />
        <Route path="/data-entry/admin/:year/:month/:Id" element={<DataEntry />} />
        <Route path="/DirectorPayable/admin/:year/:month/:Id" element={<DirectorPayable/>} />
        <Route path="/data-entry/admin/:year/:month" element={<GetRegisterData />} />
        <Route path="/getDirector/admin/:year/:month" element={<GetDirectorDetails/>} />
        <Route path="/data-entry/admin/:Year/:month/:Id/staff" element={<StaffData/>} />
        <Route path="/ViewData/:name/:id/:year/:month" element={<ViewData/>} />
      </Routes>/
    </Router>
    </>
  );
};

export default App;
