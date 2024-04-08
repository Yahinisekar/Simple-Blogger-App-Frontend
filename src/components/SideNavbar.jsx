import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, Navigate, Outlet, useLocation } from "react-router-dom";
import { userContext } from "../App";

const SideNavbar = () => {
  const {
    userAuth: { accessToken,new_notification_available },
  } = useContext(userContext);
  const location = useLocation();
  const page = location.pathname.split("/")[2];
  const [pageState, setPageState] = useState(page);
  const [showSide, setShowSide] = useState(false);

  const activeTab = useRef();
  const sidebarIcon = useRef();
  const pageStateTab = useRef();

  const changePageState = (e) => {
    const { offsetWidth, offsetLeft } = e.target;
    activeTab.current.style.width = offsetWidth + "px";
    activeTab.current.style.Left = offsetLeft + "px";

    if (e.target === sidebarIcon.current) {
      setShowSide(true);
    } else {
      setShowSide(false);
    }
  };

  useEffect(() => {
    setShowSide(false);
    pageStateTab.current.click();
  }, [pageState]);

  return accessToken === null ? (
    <Navigate to="/login" />
  ) : (
    <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
      <div className="sticky top-[80px] z-10">
        <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
          <button
            ref={sidebarIcon}
            className="p-5 capitalize"
            onClick={changePageState}
          >
            <i className="fa-solid fa-bars"></i> 
          </button>
          <button
            ref={pageStateTab}
            className="p-5 capitalize"
            onClick={changePageState}
          >
            {pageState}
          </button>
          <hr
            ref={activeTab}
            className="absolute bottom-0 duration-500 h-5 border-red-400 border-spacing-2"
          />
        </div>

        <div
          className={
            " min-w-[200px] h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-gray-100 md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500  " +
            (!showSide
              ? "max-md:opacity-0 max-md:pointer-events-none"
              : " opacity-100 pointer-events-auto")
          }
        >
          <h1 className="text-xl text-gray-500 mb-3">Dashboard</h1>
          <hr className="border-red-100 -ml-6 mb-8 mr-6 " />
          <NavLink
            to="/dashboard/blogs"
            onClick={(e) => setPageState(e.target.innerText)}
            className="sidebar-link"
          >
            <i className="fa-brands fa-blogger"></i>Blogs
          </NavLink>
          <NavLink
            to="/dashboard/notifications"
            onClick={(e) => setPageState(e.target.innerText)}
            className="sidebar-link"
          >
            <div className="relative">
              <i className="fa-regular fa-bell"></i>
              {new_notification_available ? (
                <span className="bg-red-800 w-2 h-2 rounded-full absolute top-0 right-0 z-10"></span>
              ) : (
                ""
              )}{" "}
            </div>
            Notifications
          </NavLink>
          <NavLink
            to="/editor"
            onClick={(e) => setPageState(e.target.innerText)}
            className="sidebar-link"
          >
            <i className="fa-regular fa-pen-to-square"></i>Write
          </NavLink>
          <h1 className="text-xl text-gray-500 mb-3 mt-10">Settings</h1>
          <hr className="border-red-100 -ml-6 mb-8 mr-6" />

          <NavLink
            to="/settings/edit-profile"
            onClick={(e) => setPageState(e.target.innerText)}
            className="sidebar-link"
          >
            <i className="fa-solid fa-user-tie "></i> Edit Profile
          </NavLink>
          <NavLink
            to="/settings/change-password"
            onClick={(e) => setPageState(e.target.innerText)}
            className="sidebar-link "
          >
            <i className="fa-solid fa-lock"></i> Change Password
          </NavLink>
        </div>
      </div>
      {/* <div className="max-md:mt-8 mt-5 w-full">
        <Outlet />
      </div>
   */}
      <div className="max-md:mt-8 mt-5 w-full">
        <Outlet />
      </div>
    </section>
  );
};

export default SideNavbar;
