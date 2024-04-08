import React, { useContext, useState } from 'react'
import { getFullDay } from '../common/CurrentDate';
import { userContext } from '../App';
import CommentPage from './CommentPage';
import Comment from './Comment';
import { BlogContext } from '../Pages/BlogPage';
import axios from 'axios';

const CommentCard = ({ index, leftVal, commentData }) => {
    
    let { commented_by: { personal_info: { profile_img, name, username:commented_by_username } }, commentedAt, comment, _id ,children} = commentData;
    
    let {blog,blog:{comments,activity,activity:{total_parent_comments},comments:{results:commentsArr},author:{personal_info:{username:blog_author}}},setBlog,setTotalComments} =useContext(BlogContext)

  const [isReply, setReply] = useState(false);
  const [showReplies, setShowReplies] = useState({});

    
    let {userAuth:{accessToken,username}}=useContext(userContext)
    const handleReply = () => {
        if (!accessToken) {
            return toast.error("Please login first to  reply the comment");
        }

        setReply(preVal=>!preVal);
    }

    const getParentIndex = () => {
        let startingPoint = index - 1;

        try {
            while (commentsArr[startingPoint].childrenLevel >= commentData.childrenLevel) {
                startingPoint--;  
            }
        } catch {
            startingPoint = undefined;
        }
        return startingPoint;
    }

    const removeCommentCards = (startingPoint,isDelete =false) => {
        if (commentsArr[startingPoint]) {
            while (commentsArr[startingPoint].childrenLevel > commentsArr[index].childrenLevel) {
                commentsArr.splice(startingPoint, 1)
                if (!commentsArr[startingPoint]) {
                    break;
                }
            }
        }
        if (isDelete) {
            let parentIndex = getParentIndex()
            if (parentIndex !== undefined) {
                commentsArr[parentIndex].children =
                    commentsArr[parentIndex].children.filter(child => child !== _id)
                if (!commentsArr[parentIndex].children.length) {
                    commentsArr[parentIndex].isReply = false;
                }
            }
            commentsArr.splice(index, 1);

        }
        if (commentData.childrenLevel == 0 && isDelete) {
            setTotalComments(preVal=> preVal - 1)
        }
        setBlog({...blog, comments:{results : commentsArr},activity:{...activity, total_parent_comments:total_parent_comments - (commentData.childrenLevel == 0 && isDelete ? 1:0 )}})
    }

  //   const hideReply = () => {
  //       commentData.isReply = false;
  //       removeCommentCards(index + 1);
  // }
  const hideReply = () => {
    commentData.isReply = false;
    removeCommentCards(index + 1);
    // Reset the visibility state for the current reply button
    setShowReplies((prevState) => ({
      ...prevState,
      [index]: false,
    }));
  };
  const showReply = ({ skip = 0, currentIndex = index }) => {
    if (commentsArr[currentIndex].children.length) {
      hideReply();
      axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + "/get-replies", {
          _id: commentsArr[currentIndex]._id,
          skip,
        })
        .then(({ data: { replies } }) => {
          commentsArr[currentIndex].isReply = true;
          for (let i = 0; i < replies.length; i++) {
            replies[i].childrenLevel =
              commentsArr[currentIndex].childrenLevel + 1;
            commentsArr.splice(currentIndex + 1 + i + skip, 0, replies[i]);
          }
          setBlog({
            ...blog,
            comments: { ...comments, results: commentsArr },
          });
          // Set the visibility state for the current reply button
          setShowReplies((prevState) => ({
            ...prevState,
            [currentIndex]: true,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // const showReply = ({ skip = 0, currentIndex = index }) => {
  //   if (commentsArr[currentIndex].children.length) {
  //     hideReply();
  //     axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-replies", { _id: commentsArr[currentIndex]._id, skip }).then(({ data: { replies } }) => {
  //       commentsArr[currentIndex].isReply = true;
  //       for (let i = 0; i < replies.length; i++) {
  //         replies[i].childrenLevel =
  //           commentsArr[currentIndex].childrenLevel + 1;
  //         commentsArr.splice(currentIndex + 1 + i + skip, 0, replies[i]);
  //       }
  //       setBlog({ ...blog, comments: { ...comments, results: commentsArr } })
  //     })        // Set the visibility state for the current reply button
  //     setShowReplies((prevState) => ({
  //       ...prevState,
  //       [currentIndex]: true,
  //     }));
  //   })
  

  //             .catch(err => {
  //               console.log(err)
  //           })
  //       }
      

  
  const LoadMoreReplies = () => {

    let parentIndex = getParentIndex();

let button = (
  <button
    onClick={() =>
      showReply({
        skip: index - parentIndex,
        currentIndex: parentIndex,
      })
    }
    className="text-gray-500 p-2 px-3 hover:bg-gray-500/20 rounded-md flex items-center gap-2"
  >
    Load More
  </button>
);

    if (commentsArr[index + 1]) {
      if (commentsArr[index + 1].childrenLevel < commentsArr[index].childrenLevel) {
        if ((index - parentIndex) < commentsArr[parentIndex].children.length) {
          

          return button;
        
  
        }
      }
    } else {
      if (parentIndex) {
        if (index - parentIndex < commentsArr[parentIndex].children.length) {
          return button;
        }
      }
    }
  }

    const deleteComment = (e) => {

        e.target.setAttribute("disabled", true);

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/delete-comment', { _id }, {
            headers: {
                'Authorization':`Bearer ${accessToken}`
            }
        }).then(() => {
            e.target.removeAttribute("disabled");
            removeCommentCards(index + 1, true);
        }).catch(err => {
            console.log(err);
        })
        // console.log("click")

    }

  return (
    <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className="my-5 p-6 rounded-md border border-gray-100">
        <div className="flex gap-3 items-center mb-8">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">
            @{commented_by_username} {name}
          </p>
          <p className="min-w-fit">{getFullDay(commentedAt)}</p>
        </div>
        <p className="text-xl ml-3">{comment}</p>
        <div className="flex gap-5 items-center mt-5">
          {showReplies[index] ? (
            <button
              className="text-red-400 p-2 px-3 hover:bg-gray-400/10 rounded-md flext items-center gap-2 "
              onClick={hideReply}
            >
              Hide Reply <i className="fa-solid fa-comment"></i>
            </button>
          ) : (
            <button
              className="text-gray-500 p-2 px-3 hover:bg-gray-400/10 rounded-md flext items-center gap-2 "
              onClick={showReply}
            >
              {children.length} Reply
            </button>
          )}
          <button className="underline" onClick={handleReply}>
            Reply
          </button>
          {username == commented_by_username || username == blog_author ? (
            <button
              className="p-2 px-3 rounded-md ml-auto border-gray-200 hover:bg-red-300/10 hover:text-red-500 flex items-center"
              onClick={deleteComment}
            >
              <i className="fa-regular fa-trash-can"></i>
            </button>
          ) : (
            ""
          )}
        </div>
        {isReply ? (
          <div className="mt-8">
            {" "}
            <Comment
              action="reply"
              index={index}
              replyingTo={_id}
              setReply={setReply}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      <LoadMoreReplies/>
    </div>
  );
}

export default CommentCard