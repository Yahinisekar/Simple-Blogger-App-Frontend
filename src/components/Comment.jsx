import React, { useContext, useState } from 'react'
import { userContext } from '../App';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { BlogContext } from '../Pages/BlogPage';

const Comment = ({action, index=undefined,replyingTo = undefined ,setReply}) => {
    const [comment, setComment] = useState("");
    let { userAuth: { accessToken,username,name,profile_img } } = useContext(userContext)
    const {
      blog,
      blog: {
        _id,
        author: { _id: blog_author },
        comments,comments:{results:commentsArr},
        activity,
        activity: { total_comments, total_parent_comments },
      },setBlog,
      setTotalComments,
    } = useContext(BlogContext);

    const handleComment = () => {
        if (!accessToken) {
            return toast.error( "Please login first to comment!");
        }
        if (!comment.length) {
            return toast.error("Write something to leave as a comment")
        }
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", {
            _id, blog_author, comment,replying_to:replyingTo
        }, {
            headers:{
               'Authorization': `Bearer ${accessToken}`
            }
        }).then(({ data }) => {
            // console.log(data);
            //to clear the comment input
             setComment("");
            

         data.commented_by = { personal_info: { username, profile_img, name } }

            let newCommentArr;
            if (replyingTo) {
                
                commentsArr[index].children.push(data._id);

                data.childrenLevel = commentsArr[index].childrenLevel + 1;

                data.parentIndex = index;
                commentsArr[index].isReply = true;

                commentsArr.splice(index + 1, 0, data);
                newCommentArr = commentsArr
                setReply(false);
            } else {
               data.childrenLevel = 0;

               newCommentArr = [data, ...commentsArr];
 
            }

            
            let parentCommentIncrementVal = replyingTo ? 0: 1;

         setBlog({...blog,comments:{...comments,results:  newCommentArr},activity:{...activity,total_comments:total_comments + 1,total_parent_comments: total_parent_comments + parentCommentIncrementVal}})
   
           setTotalComments(preVal=>preVal + parentCommentIncrementVal)
           

        })
            .catch(err => {
            console.log(err);
        })

    }

    
  return (
      <>
          <Toaster/>
          <textarea defaultValue={comment} onChange={(e)=>setComment(e.target.value) } placeholder="Leave your comment..." className='input-box pl-5 resize-none placeholder:text-gray-500 h-[120px] placeholder:text-sm overflow-auto'></textarea> 
          <button className='btn-dark mt-5 px-10' onClick={handleComment}>{action}</button>
      </>
  )
}

export default Comment