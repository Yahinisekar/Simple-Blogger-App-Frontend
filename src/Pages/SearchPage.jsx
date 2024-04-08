import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import PageNavigation from '../components/PageNavigation';
import Loader from '../components/Loader';
import BlogPost from '../components/BlogPost';
import Animation from '../common/Animation';
import NoData from '../components/NoData';
// import LoadMore from '../components/LoadMore';
import axios from 'axios';
import { FilterPagination } from '../common/FilterPagination';
import UserCard from '../components/UserCard';

const SearchPage = () => {
    let { query } = useParams();
    const [blogs, setBlogs] = useState(null);
    const [users, setUsers] = useState(null);

    const searchBlogs = ({ page = 1, create_new_arr = false }) => {
        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            query,
            page,
          })
          .then(async ({ data }) => {
            // console.log(data.blogs)
            let formatData = await FilterPagination({
              state: blogs,
              data: data.blogs,
              page,
                countRoute: "/search-blogs-count",
                data_to_send: { query },
              create_new_arr
            });
            // console.log(formatData);
            setBlogs(formatData);
          })
          .catch((err) => {
            console.log(err);
          });
    }

    const fetchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query }).then(({ data:{users} } )=> {
            setUsers(users);
        })
    }
        
    

    useEffect(() => {
        resetState();
        searchBlogs({ page: 1, create_new_arr: true });
        fetchUsers();
    
    }, [query])
    
    const resetState = () => {
        setBlogs(null);
        setUsers(null);
    }
    
    const UserCardWrapper = () => {
        // console.log(users);
        return (
            <>
                {
                    users == null ? <Loader /> : users.length ? users.map((user, i) => {
                        return(
                        <Animation key={i} transition={{ duration: 1,delay: i*0.08 }}>
                                <UserCard user={user } />
                            </Animation>  
                               )           })
                       :<NoData message="No users found"/> 
                }
            </>
       )
   }

    return (
      <section className="h-cover flex justify-center gap-10">
        <div className="w-full">
          <PageNavigation
            routes={[`Search Results for "${query}"`, "Accounts Matched"]}
            defaultHidden={["Accounts Matched"]}
          >
            <>
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
              {/* <LoadMore state={blogs} fetchData={searchBlogs} /> */}
            </>
            <UserCardWrapper />
          </PageNavigation>
        </div>
        <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-gray-300 pl-8 pt-3 max-md:hidden">
          <h1 className="font-medium text-xl mb-8">
            Users related to search <i className="fa-regular fa-user mt-1"></i>
          </h1>
          <UserCardWrapper />
        </div>
      </section>
    );
}

export default SearchPage