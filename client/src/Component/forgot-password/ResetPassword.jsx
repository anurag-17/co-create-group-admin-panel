import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import axios from "axios";

import RightSection from "../RightSection";
import { Link } from "react-router-dom";

import OpenEye from "../Svg/OpenEye";
import CloseEye from "../Svg/CloseEye";

const ResetPassword = () => {

    const params = useParams()
    const navigate = useNavigate()
    const [password, setPassword] = useState("");
    const [isLoading, setLoading] = useState(false);
    const resetToken = params.token
    const [showPassword, setShowPassword] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await axios.put(`/api/auth/resetpassword/${resetToken}`, {password:password}, {
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${resetToken}`,
                },
            });

            if (response.status === 201) {
                toast.success("Password change successful!")
                setLoading(false)
                navigate("/admin-login")
            } else {
                toast.error("Invalid password!")
                setLoading(false)
            }
        } catch (error) {
            if (error.status === 401) {
                toast.error(error?.response?.data)
                setLoading(false)
            }
            else{
                console.error('Error during login:', error);
                toast.error("Failed please try again!")
                setLoading(false)
            }
        }
    };


    return (
        <div className="flex items-center justify-center lg:min-h-screen  ">
            <div className="md:px-[50px] w-full mx-auto">
                <div
                    className="relative flex flex-col 2xl:gap-x-20 xl:gap-x-10 gap-x-7 min-h-screen justify-center lg:shadow-none  items-center lg:flex-row space-y-8 md:space-y-0 w-[100%] px-[10px]bg-white lg:px-[40px] py-[20px] md:py-[40px] "
                >

                    <div className="w-[100%] lg:w-[60%] xl:w-[50%]">
                        <form action="" className="" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-4 justify-center p-8 lg:p-14 md:max-w-[80%] lg:w-full lg:max-w-[100%] mx-auto ">
                                <div className="text-left ">
                                    <p className="mb-2 2xl:text-[40px] md:text-[35px] text-[30px] leading-[38px] font-bold">Reset your password</p>
                                    <p className=" md:text-[16px] text-[15px] font-[400] leading-[26px] text-gray-400 mt-2 mb-4 text-[#494949]">
                                        Please enter a new password to access admin dashboard
                                    </p>
                                </div>
                                <div className="relative flex justify-center items-center mt-4 md:py-2">
                                    <input
                                         type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Password"
                                        className="login-input w-full  custom-input"
                                        onChange={(e) => setPassword(e.target.value)}
                                        minLength = {8}
                                        required />
                                         <div
                        className="absolute right-[10px] cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <OpenEye /> : <CloseEye />}
                      </div>
                                </div>

                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-[#1f2432] font-medium text-white p-2 rounded-lg  hover:bg-white hover:border hover:border-gray-300 h-[50px] login-btn"
                                    >
                                        {isLoading ? "Loading.." : "Reset password"}
                                    </button>
                                   
                                    <Link to="/admin-login">
                                        <div className="text-[16px] font-medium underline text-center py-3 cursor-password">Login</div>
                                    </Link>
                                </div>

                            </div>
                        </form>
                    </div>
                    <RightSection />
                </div>
            </div>
        </div>
    )
};

export default ResetPassword;

