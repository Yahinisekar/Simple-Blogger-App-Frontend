import React, { useContext, useEffect, useState } from 'react'
import logo from "/images/Designer.png"
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { userContext } from '../App';

import NavigationUser from './NavigationUser.jsx';
import axios from 'axios';

const Navbar = () => {
  const [clickEvent, setClick] = useState(false)
  const [userNav, setUserNav] = useState(false);

  const navigate = useNavigate();
   
  const {
    userAuth,
    userAuth: { accessToken, profile_img, new_notification_available },setuserAuth} = useContext(userContext);

  const handleUserNav = () => {
    setUserNav(currentVal=> !currentVal)
  }



  const handleBlur = () => {
    setTimeout(() => {
       setUserNav(false);
    }, 200);
    
  }
  const handleSearch = (e) => {
    let query = e.target.value;
    
    if (e.keyCode == 13 && query.length) {
      navigate(`/search/${query}`);
    }
  }


    useEffect(() => {
      const handleResize = () => {
        // Update the clickEvent state based on screen width
        setClick(window.innerWidth >= 768); // Assuming 768px as the breakpoint for medium screen
      };

      // Add event listener for screen size changes
      window.addEventListener("resize", handleResize);

      // Cleanup function to remove event listener
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);
  
  useEffect(() => {
    if (accessToken) {
      axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/new-notification", {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
      }).then(({ data }) => {
           setuserAuth({...userAuth,...data})
      }).catch(err => {
        console.log(err);
        })
      }
  },[accessToken])
  // console.log(new_notification_available);
    return (
      <>
        <nav className="navbar ">
          <Link to="/" className="flex-none w-10">
            <img src={logo} alt="logo" className="w-full" />
          </Link>

          {/* <p>{new_notification_available}</p> */}

          {/* <div
            className={
              "absolute w-full left-0 top-full mt-0.5 border-b py-4 px-[5vw] md:border-0 md:relative md:inset-0 md:p-0  md:w-auto md:block md:show  " +
              (clickEvent ? "show" : "hide")
            }
          > */}
          <div
            className={`absolute w-full left-0 top-full mt-0.5 border-b py-4 px-[5vw] md:border-0 md:relative md:inset-0 md:p-0 md:w-auto md:block ${
              clickEvent ? "show" : "hide"
            }`}
          >
            <input
              className="w-full md:w-auto p-3 pl-6 pr-[12%] md:pr-6 rounded-full md:pl-12 bg-red-50"
              type="text"
              placeholder="Search"
              onKeyDown={handleSearch}
            />
            <i className="fa-solid fa-magnifying-glass absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-gray-600 "></i>
          </div>
          <div className="flex items-center gap-3 md:gap-6 ml-auto">
            <button
              className="md:hidden w-12 h-12 bg-teal-50 rounded-full"
              onClick={() => setClick((currentVal) => !currentVal)}
            >
              <i className="fa-solid fa-magnifying-glass text-xl"></i>
            </button>

            {userAuth.accessToken ? (
              <Link to="/editor" className="hidden md:flex gap-2 link">
                <i className="fa-solid fa-file-pen"></i>
                <p>Write</p>
              </Link>
            ) : (
              <p
                className="hidden md:flex gap-2 link"
                onClick={() => navigate("/login")}
              >
                <i className="fa-solid fa-file-pen"></i>
                Write
              </p>
            )}

            {/* <Link to="/editor" className="hidden md:flex gap-2 link">
              <i className="fa-solid fa-file-pen"></i>
              <p>Write</p>
            </Link> */}
            {accessToken ? (
              <>
                <Link to="/dashboard/notifications">
                  <button className="relative w-12 h-12 rounded-full bg-red-100/10 hover:bg-red-200">
                    <i className="fa-regular fa-bell text-2xl block"></i>
                    {new_notification_available ? (
                      <span className="bg-red-500 w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                    ) : (
                      ""
                    )}
                  </button>
                </Link>
                <div
                  className="relative"
                  onClick={handleUserNav}
                  onBlur={handleBlur}
                >
                  <button className="w-12 h-12 mt-2">
                    <img
                      src={profile_img}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </button>
                </div>
                {userNav ? <NavigationUser /> : ""}
              </>
            ) : (
              <>
                <Link to="/login" className="btn-dark py-2">
                  Login
                </Link>
                <Link to="/signup" className="btn-light py-2 hidden md:block">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
        <Outlet />
      </>
    );
}

export default Navbar