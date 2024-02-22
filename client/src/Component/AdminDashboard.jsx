import React, { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";

import Dashboard from "./Dashboard";

import CloseIcon from "./Svg/CloseIcon";
import LogoutIcon from "./Svg/Logout";
import Pages from "./pages/Pages";
import SubPages from "./sub-pages/SubPages";
import Enquiry from "./enquiry/Enquiry";
import ContactDetails from "./contact-details/ContactDetails";
import PageIcon from "../assets/svg/page.svg";
import HomeIcon from "../assets/svg/home.svg";
import CallIcon from "../assets/svg/call.svg";
import webIcon from "../assets/svg/web-site.svg";
import conversation from "../assets/svg/conversation.svg";
import contactIcon from "../assets/svg/contact-mail.svg";
import ScheduleMeeting from "./schedule-meeting/ScheduleMeeting";
import Newsletter from "./newsletter/Newsletter";

export const menus = [
  {
    id: 1,
    label: "Dashboard",
    component: <Dashboard />,
    icon: HomeIcon,
  },
  {
    id: 2,
    label: "Pages",
    component: <Pages />,
    icon: PageIcon,
  },
  {
    id: 3,
    label: "Subpages",
    component: <SubPages />,
    icon: webIcon,
  },
  {
    id: 4,
    label: "Enquiry",
    component: <Enquiry />,
    icon: conversation,
  },
  {
    id: 5,
    label: "Contact Details",
    component: <ContactDetails />,
    icon: contactIcon,
  },
  {
    id: 6,
    label: "Signup members",
    component: <Newsletter />,
    icon: CallIcon,
  },
];

const SideMenu = () => {
  const [ComponentId, setComponentId] = useState(6);
  const [showDrawer, setShowDrawer] = useState(false);
  const navigate = useNavigate();
  console.log(showDrawer);
  const handleClick = (id) => {
    setComponentId(id);
    setShowDrawer(false);
  };

  const handleSignout = () => {
    sessionStorage.removeItem("sessionToken");
    sessionStorage.removeItem("adminId");
    navigate("/admin-login");
  };

  return (
    <section className="">
      <div className="flex min-h-screen relative lg:static">
        {!showDrawer && (
          <div
            className="py-2 px-3  absolute top-4 left-2 flex flex-col gap-[5px] cursor-pointer lg:hidden z-10"
            onClick={() => setShowDrawer(true)}
          >
            <div className="bg-black h-[2px] w-[20px] z-10"></div>
            <div className="bg-black h-[2px] w-[20px] z-10"></div>
            <div className="bg-black h-[2px] w-[20px] z-10"></div>
          </div>
        )}
        <div
          className={`w-[300px] bg-menu_primary text-white lg:px-[20px] px-[10px]  drawer
                 ${
                   showDrawer
                     ? "block  absolute top-0 left-0 min-h-screen is-show z-10"
                     : "hidden lg:block"
                 }`}
        >
          <div
            className="relative text-white  flex flex-col gap-[5px] cursor-pointer lg:hidden  text-right mr-3 mt-2"
            onClick={() => setShowDrawer(false)}
          >
            <div className="">
              {" "}
              <CloseIcon />{" "}
            </div>
          </div>

          <div className="flex flex-col justify-between min-h-screen  lg:py-[40px] py-[10px] ">
            <div className="">
              <div className="flex justify-center items-center whitespace-pre-wrap ">
                <h1 className="2xl:text-[30px] lg:text-[26px] text-[24px] font-semibold  text-center whitespace-nowrap pt-4">
                  Admin Dashboard
                </h1>
              </div>
              <div className="bg-white h-[1px] w-[70%] mx-auto mt-[40px]"></div>
            </div>

            <div className="flex flex-col 2xl:gap-6 gap-3 pt-[20px]">
              {menus.map((item, index) => (
                <div
                  key={index}
                  className={`pl-3 py-3 mx-5 rounded-md  flex gap-x-3 items-center cursor-pointer  transition-colors font-semibold dash-menu  hover:transition-all ease-in delay-100 duration-300  
                                    ${
                                      item.id === ComponentId
                                        ? "bg-menu_secondary"
                                        : "hover:menu_secondary hover:text-white hover:rounded-md"
                                    }  `}
                  onClick={() => handleClick(item.id)}
                >
                  <img
                    src={item?.icon}
                    alt={item.label}
                    height={30}
                    width={30}
                    className="h-[20px] w-[20px] fill-white"
                  />

                  <p className=" capitalize whitespace-nowrap ">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="">
              <div className="bg-white h-[1px] w-[70%] mx-auto my-[40px]"></div>
              <div
                className={` pl-6 py-3 mx-5 rounded text-center cursor-pointer my-3 flex items-center transition-colors dash-menu gap-x-3  font-semibold hover:bg-menu_secondary hover:text-white hover:rounded-md }`}
                onClick={handleSignout}
              >
                <LogoutIcon />
                <div>
                  <p>Sign Out</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#f3f3f3] w-full">
          {menus.map((item, index) => (
            <Fragment key={index}>
              {ComponentId === item.id && item.component}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SideMenu;
