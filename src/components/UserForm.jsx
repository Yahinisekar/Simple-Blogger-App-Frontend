import React, { useContext } from "react";
import Input from "./Input";
import googleicon from "/images/google.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Animation from "../common/Animation";
import { Toaster, toast } from "react-hot-toast";
// import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { storeSession } from "../common/Session";
import { userContext } from "../App";
import { authwithGoogle } from "../common/Firebase";

const UserForm = ({ type }) => {
  const navigate = useNavigate();
  let {
    userAuth: { accessToken },
    setuserAuth,
  } = useContext(userContext);

  // const userAuth = (serverRoute, formData) => {
  //   axios
  //     .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
  //     .then(({ data }) => {
  //       storeSession("user", JSON.stringify(data));
  //       setuserAuth(data);
  //       if (serverRoute === "/signup") {
  //         // Redirect to home page after successful signup
  //         return <Navigate to="/" />;
  //       } else {
  //         toast.success("Successfully logged in!"); // Toast for successful login
  //       }
  //     })
  //     .catch((error) => {
  //       if (error.response && error.response.status === 401) {
  //         toast.error("Incorrect email or password. Please try again."); // Toast for incorrect password
  //       } else if (error.response) {
  //         console.log(error.response.data.error);
  //         toast.error(error.response.data.error);
  //       } else {
  //         console.error("Error:", error.message);
  //         toast.error("An error occurred while processing your request.");
  //       }
  //     });
  // };
  
   const userAuth = (serverRoute, formData, redirect = true) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeSession("user", JSON.stringify(data));
        setuserAuth(data);
        toast.success(
          serverRoute === "/signup"
            ? "Signup Successful! Redirecting..."
            : "Successfully logged in!"
        ); // Toast for successful login or signup

        if (redirect && serverRoute === "/signup") {
          // Redirect to home page after successful signup
          navigate('/home') // Assuming you have imported `navigate` from 'react-router-dom'
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          toast.error("Incorrect email or password. Please try again."); // Toast for incorrect password
        } else if (error.response && error.response.status === 409) {
          toast.error(
            "Email or username already in use. Please use a different one."
          ); // Toast for conflict (409)
        } else if (error.response) {
          console.log(error.response.data.error);
          toast.error(error.response.data.error);
        } else {
          console.error("Error:", error.message);
          toast.error("An error occurred while processing your request.");
        }
      });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type === "login" ? "/login" : "/signup";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    let form = new FormData(formElement);

    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { name, email, password: password } = formData;

    if (type !== "login" && (!name || name.trim().length < 3)) {
      return toast.error("Name must be greater than 3 characters");
    }

    if (!email || !email.length) {
      return toast.error("Enter Email");
    } else if (!emailRegex.test(email)) {
      return toast.error("Invalid Email Id");
    }

    if (!passwordRegex.test(password)) {
      return toast.error(
        "The Password should contain at least one upper case letter, one lowercase letter along with one numeric"
      );
    }

    userAuth(serverRoute, formData);
  };

const handleGoogleAuth = async (e) => {
  e.preventDefault();
  await authwithGoogle()
    .then((user) => {
      let serverRoute = "/google-auth";

      let formData = {
        accessToken: user.accessToken,
      };
      userAuth(serverRoute, formData);
      toast.success("Successfully signed in with Google!"); // Toast for successful Google authentication
    })
    .catch((err) => {
      toast.error("Error in Google Authentication");
      console.error(err);
    });
}

  return (
    <>
      {accessToken ? (
        <Navigate to="/home" />
      ) : (
        <Animation keyValue={type}>
          <section className="h-cover flex items-center justify-center">
            <Toaster /> {/* Container for displaying toasts */}
            <form
              id="formElement"
              className="w-[80%] max-w-[400px]"
              onSubmit={handleSubmit}
            >
              <h1 className="text-4xl capitalize text-center mb-10 text-red-600">
                {type === "login" ? "Welcome Back" : "Welcome to Blog"}
              </h1>
              {type !== "login" ? (
                <Input
                  name="name"
                  type="text"
                  placeholder="Name"
                  icon="fa-user"
                />
              ) : (
                ""
              )}
              <Input
                name="email"
                type="email"
                placeholder="Email"
                icon="fa-envelope"
              />
              {type == "login" ? (
                <Link>
                  
                  {/* <p className="text-red-500 flex justify-end items-end">
                    Forgot password ?
                  </p> */}
                </Link>
              ) : (
                ""
              )}
              <Input
                name="password"
                type="password"
                placeholder="Password"
                icon="fa-lightbulb"
              />

              <button className="btn-dark center mt-14" type="submit">
                {type.replace("-", " ")}
              </button>

              <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                <hr className="w-1/2 border-black" />
                <p>or</p>
                <hr className="w-1/2 border-black" />
              </div>
              <button
                className="btn-dark flex items-center justify-center gap-4 center w-[90%]"
                onClick={handleGoogleAuth}
              >
                <img src={googleicon} className="w-5" alt="Google icon" />
                Continue with Google
              </button>
              {type === "login" ? (
                <p className="mt-6 text-xl text-center">
                  Don't have an account ?
                  <Link
                    to="/signup"
                    className="underline text-red-400 text-xl ml-1"
                  >
                    Let's join us.
                  </Link>
                </p>
              ) : (
                <p className="mt-6">
                  Already have an account ?
                  <Link
                    to="/login"
                    className="underline text-red-400 text-xl ml-1"
                  >
                    Login here.
                  </Link>
                </p>
              )}
            </form>
          </section>
        </Animation>
      )}
    </>
  );
};

export default UserForm;
