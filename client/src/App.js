import { Route, Routes, BrowserRouter, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import SideMenu from "./Component/AdminDashboard";
import './App.css';

import "react-toastify/dist/ReactToastify.css";
import ResetPassword from "./Component/forgot-password/ResetPassword";
import ForgotPassword from "./Component/forgot-password/ForgotPassword";
import ChangePassword from "./Component/change-password/Index";
import AdminDashboard from "./Component/Login";
import AdminLogin from "./Component/Login";

function App() {

  function PrivateRoute({ path, element }) {

    const isAuthenticated = JSON.parse(sessionStorage.getItem("sessionToken")) !== null;
  
    return isAuthenticated ? (
      element
    ) : (
      <Navigate to="/admin-login" />
    );
  }
 
  return (

    <div>
      
      <BrowserRouter>
        <Routes>

          {/* <Route path="/" element={<AdminLogin />} /> */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route
            path="/admin-dashboard"
            element={<PrivateRoute element={<SideMenu />} />}
          />
          <Route
            path="/"
            element={<PrivateRoute element={<SideMenu />} />}
          />

        </Routes>
      </BrowserRouter>
      <ToastContainer

      />
    
    </div>
  );
}

export default App;
