import React, { useContext, useEffect } from 'react'
import { BlogContext } from '../Pages/BlogPage'
import { Link } from 'react-router-dom';
import { userContext } from '../App';
import { Toaster,toast } from 'react-hot-toast';
import axios from 'axios';

const BlogInteraction = () => {
    let { blog,blog: {_id, title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setBlog ,isLiked,setIsLiked,setComments} = useContext(BlogContext)
    
  const { userAuth: { username, accessToken } } = useContext(userContext)
  
  useEffect (() => { 
    if (accessToken) {
      //To make request to server to get the liked information
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user", { _id }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }).then(({ data: { result } }) => {
        setIsLiked(Boolean(result));
      }).catch((err)=>console.error("Error in getting whether a blog is liked by the user or not : ", err))
   }
  },[])

  const handleLike = () => {
    if (accessToken) {
      //like the blog post
      setIsLiked(preVal => !preVal);
      !isLiked ? total_likes++ : total_likes--
      
      setBlog({ ...blog, activity: { ...activity, total_likes } })
      
      axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id, isLiked }, {
        headers: {
          'Authorization':`Bearer ${accessToken}`
        }
      }).then(({ data }) => {
        console.log(data);
      })
        .catch(err => {
          console.log(err);
      })
    } else {
      //not loggedin
      toast.error("Please login to like the post")
      }
  }

    return (
      <>
        <Toaster />
        <hr className="border-red-200 my-2" />
        <div className="flex gap-6 justify-between">
          <div className="flex gap-3 items-center">
            <button
              className={"w-10 h-10 rounded-full flex items-center justify-center " + (isLiked ? "bg-yellow-50 text-yellow-500" : "bg-slate-200")}
              onClick={handleLike}
            >
              <i className="fa-solid fa-hands-clapping"></i>
            </button>
            <p className="text-xl text-red-400">{total_likes}</p>

            <div className="flex gap-3 items-center">
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100/80" onClick={() => {setComments(preVal=> !preVal)}}>
                <i className="fa-solid fa-comment-dots"></i>
              </button>
              <p className="text-xl text-red-400">{total_comments}</p>
            </div>
          </div>
          <div className="flex gap-6 items-center">
            {username == author_username ? (
              <Link
                to={`/editor/${blog_id}`}
                className="underline hover:text-red-500"
              >
                Edit
              </Link>
            ) : (
              ""
            )}
            <Link
              to={`https://twitter.com/intent/tweet?text=Read${title}&url=${location.href}`}
              target="_blank"
            >
              <i className="fa-brands fa-twitter hover:text-blue-500"></i>
            </Link>
          </div>
        </div>
        <hr className="border-red-200 my-2" />
      </>
    );
}

export default BlogInteraction