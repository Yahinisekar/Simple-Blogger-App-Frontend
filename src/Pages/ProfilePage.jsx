import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Animation from '../common/Animation'
import Loader from '../components/Loader'
import { userContext } from '../App'
import AboutUser from '../components/AboutUser'
import { FilterPagination } from '../common/FilterPagination'
import PageNavigation from '../components/PageNavigation'
import BlogPost from '../components/BlogPost'
import NoData from '../components/NoData'
import LoadMore from '../components/LoadMore'
import PageNotFound from '../components/PageNotFound'

export const profileData =  {
    personal_info: {
        name: "",
        username: "",
        profile_img: "",
        bio:"",
    },
    account_info: {
        total_posts: 0,
        total_reads:0
    },
    social_links: {},
    joinedAt: " "
}

const ProfilePage = () => {
    //rename the params id to profileId
    let { id: profileId } = useParams();
    // console.log(profileId);
    const [profile, setprofile] = useState(profileData);
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState(null)
    const [profileLoaded, setProfileLoaded] = useState("");

    let {userAuth:{name}} =useContext(userContext)
    let { personal_info:{name:profile_username,profile_img, bio},account_info:{total_posts,total_reads},social_links,joinedAt}=  profile;
    const fetchUserProfile = () => {
      axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {
          name: profileId,
        })
        .then(({ data: user }) => {
            //   console.log(user);
            if (user !== null) {
                setprofile(user);
            }
            
            setProfileLoaded(profileId)
            getBlogs({user_id:user._id})
            setLoading(false);
        })
        .catch((err) => {
            console.log(err.message);
            setLoading(false);
        });
    };

    const getBlogs = ({page=1,user_id}) => {
        user_id = user_id == undefined ? blogs.user_id : user_id;

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            author: user_id,
            page
        })
            .then(async ({ data }) => {
                let formatedData = await FilterPagination({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/search-blogs-count",
                    data_to_send:{author:user_id}
                })
                formatedData.user_id = user_id;
                // console.log(formatedData);
                setBlogs(formatedData);
        })
  
    }

    useEffect(() => {
        if (profileId !== profileLoaded) {
            setBlogs(null);
        }
        if (blogs == null) {
           resetState();
           fetchUserProfile();
 
        }
 }, [profileId,blogs]);

    const resetState = () => {
        setprofile(profileData);
        setProfileLoaded("")
        setLoading(true);
    }


    return (
      <>
        <Animation>
          {loading ? (
            <Loader />
                ) : (
                        profile_username.length ?
            <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
              <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l md:sticky md:top-[100px] md:py-10">
                <img
                  src={profile_img}
                  className="w-48 h-48 rounded-full md:w-32 md:h-32"
                />
                <h1>@{profile_username}</h1>
                <p className="text-xl capitalize h-6">{name}</p>
                <p className="">
                  {total_posts.toLocaleString()} Blogs -{" "}
                  {total_reads.toLocaleString()} Reads
                </p>
                <div className="flex gap-4 mt-2">
                  {profileId === name ? (
                    <Link
                      to="/settings/edit-profile"
                      className="btn-light rounded-md"
                    >
                      Edit Profile
                    </Link>
                  ) : (
                    " "
                  )}
                </div>
                <AboutUser
                  className="max-md:hidden"
                  bio={bio}
                  social_links={social_links}
                  joinedAt={joinedAt}
                />
              </div>

              <div className="max-md:mt-12 w-full">
                <PageNavigation
                  routes={["Blogs Published", "About"]}
                  defaultHidden={["About"]}
                >
                  <>
                    {/* show loading spinner if there are no blog posts yet */}
                    {blogs == null ? (
                      <Loader />
                    ) : blogs.results.length ? (
                      blogs.results.map((blog, i) => (
                        <Animation
                          key={i}
                          transition={{ duration: 1, delay: i * 0.1 }}
                        >
                          <BlogPost
                            content={blog}
                            author={blog.author.personal_info}
                          />
                        </Animation>
                      ))
                    ) : (
                      <NoData message="Not published yet" />
                    )}
                    {/* <LoadMore
                      state={blogs}
                      fetchData={getBlogs }
                    /> */}
                  </>
                                    <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
                </PageNavigation>
              </div>
                            </section>
                            :<PageNotFound/>
          )}
        </Animation>
      </>
    );
}

export default ProfilePage