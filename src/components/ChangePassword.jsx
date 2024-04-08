import React, { useContext, useRef } from "react";
import Animation from "../common/Animation";
import Input from "./Input";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { userContext } from "../App";

const ChangePassword = () => {
  let changePasswordForm = useRef();
  let {userAuth:{accessToken}}=useContext(userContext)

  let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

  const handleSubmit = (e) => {
    e.preventDefault();

    // Use JavaScript class which extracts the data from the actual HTML form
    let form = new FormData(changePasswordForm.current);
    let formData = { };
    // Get the entries of the form
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    let { currentPassword, newPassword } = formData;

    if (!currentPassword.length || !newPassword.length) {
      return toast.error("Please fill all fields");
    }
    if (
      !passwordRegex.test(currentPassword) ||
      !passwordRegex.test(newPassword)
    ) {
      return toast.error(
        "The Password should contain at least one upper case letter, one lowercase letter along with one numeric"
      );
    }

    e.target.setAttribute("disabled", true);

    let loadingToast = toast.loading("Updating Password...");
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/change-password", formData, {
      headers: {
        'Authorization':`Bearer ${accessToken}`
      }
    }).then(() => {
      toast.dismiss(loadingToast);
      e.target.removeAttribute("disabled");
      return toast.success("Password Updated Successfully!")
    }).catch(({ response }) => {
      toast.dismiss(loadingToast);
      e.target.removeAttribute("disabled");
      return toast.error(response.data.error);

    })
  };

  return (
    <Animation>
      <Toaster />
      <form className="max-w-screen-sm mx-auto" ref={changePasswordForm}>
        <h1 className="max-md:hidden mb-10">Change Password</h1>
        <div className="py-10 w-full md:max-w-[400px]">
          <Input
            name="currentPassword"
            type="password"
            className="input-box mb-4"
            placeholder="Current Password"
            icon="fa-solid fa-unlock"
          />
          <Input
            name="newPassword"
            type="password"
            className="input-box mb-4 "
            placeholder="New Password"
            icon="fa-solid fa-unlock"
          />
          <button
            onClick={handleSubmit}
            className="btn-dark w-full"
            type="submit"
          >
            Update Password
          </button>
        </div>
      </form>
    </Animation>
  );
};

export default ChangePassword;
