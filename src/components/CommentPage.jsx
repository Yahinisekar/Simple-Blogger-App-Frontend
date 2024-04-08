import React, { useContext } from 'react'
import { BlogContext } from '../Pages/BlogPage'
import Comment from './Comment';
import axios from 'axios';
import Animation from '../common/Animation';
import CommentCard from './CommentCard';
import NoData from './NoData';


export const fetchComments = async({skip=0, blog_id,setParentCommentCountFun,comment_array=null}) => {
  let res;
  
  await axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog-comments", { blog_id, skip }).then(({ data }) => {
    data.map(comment => {
      comment.childrenLevel = 0;
    })
    setParentCommentCountFun(preVal => preVal + data.length)
    if (comment_array == null) { 
      res={results: data}
    } else {
      res={results : [...comment_array , ...data]};
    }
  }) 
  return res;
  
  // console.log(res);

}
const CommentPage = () => {
  let { blog, blog: { _id, title, comments: { results: commentsArr }, activity: { total_parent_comments } }, comments, setComments, setTotalComments, totalComments, setBlog } = useContext(BlogContext)
  // console.log(blog)
  // console.log(commentsArr);

  const loadMore = async() => {
    let newCommentsArr = await fetchComments({ skip: totalComments, blog_id: _id, setParentCommentCountFun: setTotalComments, comment_array: commentsArr })
    
    setBlog({...blog,comments:newCommentsArr})
  }
  return (
    <div
      className={`max-sm:w-full fixed ${
        comments ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]"
      } duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden`}
    >
      <div className="relative">
        <h1 className="text-xl font-medium text-red-500">Comments</h1>
        <p className="text-lg mt-2 w-[70%] text-gray-600 line-clamp-1">
          {title}
        </p>
        <button onClick={()=>setComments(preVal=>!preVal)} className='absolute top-0 right-0 flex justify-center items-center w-10 h-10 rounded-full bg-red-100 '>
          <i className="fa-solid fa-x text-xl"></i>
        </button>
          </div>
          <hr className='border-red-200 my-8 w-[120%] -ml-10' />
      <Comment action='comment' />
      {
        commentsArr && commentsArr.length ? commentsArr.map((comment, i) => {
          return <Animation key={i}>
            <CommentCard index={i} leftVal={comment.childrenLevel * 4} commentData={comment } />
          </Animation>
        }) : <NoData message="No Comments"/>
      }
      {
        total_parent_comments > totalComments ? <button onClick={loadMore } className='text-red-300 p-2 px-3 hover:bg-gray-500/20 rounded-md flex items-center gap-2'> Load More</button> : ""
      }
    </div>
  );
}

export default CommentPage