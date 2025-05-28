import React from "react";
import { Outlet } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import DoExam from "../pages/DoExam";
import UserInfo from "../pages/UserInfo";

const userRoutes = {
    path: "/student",
    element: <Outlet />, // Sửa lại ở đây, bỏ dấu ngoặc kép
    children: [
        { index: true, element: <Dashboard /> },
        { path: 'doexam',element:<DoExam />},
        {path: 'Info', element:<UserInfo />}
    ],
};
export default userRoutes;