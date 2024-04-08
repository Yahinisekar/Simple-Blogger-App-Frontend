import React, { useContext, useEffect, useRef, useState } from "react";
import { userContext } from "../App";
import axios from "axios";
import Animation from "../common/Animation";
import Loader from "./Loader";
import  { toast,Toaster } from "react-hot-toast";
import Input from "./Input";
import { uploadImage } from "../common/Aws";
import { storeSession } from "../common/Session";

const EditProfile = () => {
  const { userAuth,setuserAuth } = useContext(userContext);
  const { accessToken } = userAuth;

  const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [updatedProfile, setUpdatedProfile] = useState(null);

    let editProfile = useRef();
    let bioLimit = 150;

    let profileImg = useRef();
    const [charactersLeft,setCharactersleft] =useState(bioLimit)
    

  // let { personal_info: { name: profile_name, username, profile_img, email, bio } ,social_links} = profile;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (accessToken) {
          const response = await axios.post(
            import.meta.env.VITE_SERVER_DOMAIN + "/get-profile",
            { name: userAuth.name }
          );
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken, userAuth.name]);
    
    
    const handleChange = (e) => {
        setCharactersleft(bioLimit - e.target.value.length)
    }

    const handleImage = (e) => {
        let img = e.target.files[0];
        profileImg.current.src = URL.createObjectURL(img);

        setUpdatedProfile(img);


    }

    const handleUpload = (e) => {
        e.preventDefault();
        if (updatedProfile) { 
            let loadingToast = toast.loading('Updating Profile...');
            e.target.setAttribute('disabled', true);
            uploadImage(updatedProfile).then((url) => {
                if (url) {
                    axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/update-profile-img', { url }, {
                        headers: {
                            'Authorization':`Bearer ${accessToken}`
                        }
                    }).then(({ data }) => {
                        let newUserAuth = { ...userAuth, profile_img: data.profile_img }
                        storeSession("user", JSON.stringify(newUserAuth));
                        setuserAuth(newUserAuth);

                        setUpdatedProfile(null);

                    toast.dismiss(loadingToast);
                        e.target.removeAttribute("disabled");
                    toast.success('Uploaded successfully!')
                    }).catch(({ response }) => {
                        // console.log(response);
                        toast.dismiss(loadingToast);
                        e.target.removeAttribute("disabled");
                        toast.error(response.data.error);
                    })
                }
            }).catch(err => {
                console.log(err);
            })
        }
      

            }

    const handleSubmit = (e) => {
        e.preventDefault();
        let form = new FormData(editProfile.current);

        let formData = { };
        for (let [key, value] of form.entries()) { 
            formData[key] = value;

        }
        
        let {
          username,
          bio,
          youtube,
          facebook,
          twitter,
          github,
          instagram,
          website,
        } = formData;

        if (!username || username.length < 3) {
            return toast.error("Username must be at least 3 characters long!");
        }
        if (bio.length > bioLimit) {
            return toast.error("Bio should not exceed 150 characters.")
        }
        let loadingToast =toast.loading("Updating...")
        e.target.setAttribute("disabled", true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile", {
            username, bio,
            social_links:{youtube, facebook, twitter, github, instagram , website}
        }, {
            headers: {
                'Authorization':`Bearer ${accessToken}`
            }
        }).then(({ data }) => {
            if (userAuth.username != data.username) {
                let newUserAuth = { ...userAuth, username: data.username };
                storeSession("user", JSON.stringify(newUserAuth));
                setuserAuth(newUserAuth);
            }

            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            toast.success("Profile Updated Successfully!")
        }).catch(({response}) => {
            toast.dismiss(loadingToast);
            e.target.removeAttribute("disabled");
            toast.error(response.data.error);
      
        })

    }

  return (
    <Animation>
      {loading ? (
        <Loader />
      ) : (
        <form ref={editProfile}>
          <Toaster />
          <h1 className="max-md:hidden">Edit Profile</h1>
          <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
            <div className="max-lg:center mb-5 ">
              {profile && profile.personal_info && (
                <label
                  htmlFor="uploadImg"
                  id="profileLabel"
                  className="relative block w-48 h-48 bg-red-100/40 rounded-full overflow-hidden"
                >
                  <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                    Upload Profile
                  </div>
                  <img
                    ref={profileImg}
                    src={profile.personal_info.profile_img}
                  />
                </label>
              )}
              <input
                type="file"
                id="uploadImg"
                accept=".jpeg,.png,.jpg"
                hidden
                onChange={handleImage}
              />
              <button
                className="btn-light mt-8 max-lg:center lg:w-full px-10"
                onClick={handleUpload}
              >
                {" "}
                Upload
              </button>
            </div>
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                <div>
                  {profile && profile.personal_info && (
                    <Input
                      className=""
                      name="name"
                      type="text"
                      value={profile.personal_info.name}
                      placeholder="Name"
                      icon="fa-solid fa-user-tie"
                      disable={true}
                    />
                  )}
                </div>
                <div>
                  {profile && profile.personal_info && (
                    <Input
                      className=""
                      name="email"
                      type="email"
                      value={profile.personal_info.email}
                      placeholder="Email"
                      icon="fa-regular fa-envelope"
                      disable={true}
                    />
                  )}
                </div>
              </div>
              <div>
                {profile && profile.personal_info && (
                  <Input
                    className=""
                    name="username"
                    type="text"
                    value={profile.personal_info.username}
                    placeholder="Username"
                    icon="fa-solid fa-at"
                  />
                )}
              </div>
              <div>
                <p className="text-gray-500 -mt-3">
                  Username will use to search user and will be visible on public
                  profile.
                </p>
                {profile && profile.personal_info && (
                  <textarea
                    name="bio"
                    maxLength={bioLimit}
                    defaultValue={profile.personal_info.bio || ""}
                    className="input-box h-64 lg:h-40 resize-none leading-7 mt-5"
                    placeholder="Short Bio"
                    onChange={handleChange}
                  ></textarea>
                )}
                <p className="mt-1 text-gray-400">
                  {charactersLeft} Characters left
                </p>

                <p className="my-6 text-gray-600">
                  Add your social Links below :
                </p>
                {/* {console.log("Profile:", profile)} */}
                {profile && (
                  <div className="md:grid md:grid-cols-2 gap-x-6">
                    {/* {console.log("Social Links:", profile.social_links)} */}
                    {Object.keys(profile.social_links).map((key, index) => {
                      let link = profile.social_links[key]; // Use profile.social_links here

                      return (
                        <Input
                          key={index}
                          name={key}
                          type="text"
                          value={link}
                          placeholder="https://"
                          icon={
                            "fa-brands " +
                            (key !== "website" ? "fa-" + key : "fa-dribbble ")
                          }
                        />
                      );
                    })}
                  </div>
                )}
                <button
                  className="btn-dark w-auto px-10"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </Animation>
  );
};
export default EditProfile;
