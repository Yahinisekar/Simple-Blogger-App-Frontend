import React, { useContext, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { userContext } from '../App';
import axios from 'axios';

const NotificationComment = ({_id,blog_author,index=undefined, replyingTo = undefined,setIsReply,notification_id,notificationData}) => {


    const [comment, setComment] = useState("");

    let { _id: user_id } = blog_author;

    let { userAuth: { accessToken } } = useContext(userContext);

    let { notifications, notifications: { results }, setNotifications } = notificationData;


    const handleComment = () => {
         
         
         if (!comment.length) {
           return toast.error("Write something to leave as a comment");
         }
        axios
            .post(
                import.meta.env.VITE_SERVER_DOMAIN + "/add-comment",
                {
                    _id,
                    blog_author:user_id,
                    comment,
                    replying_to: replyingTo,
                    notification_id
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
            .then(({ data }) => {
                setIsReply(false);

              results[index].reply = { comment, _id: data._id }
              
              setNotifications({...notifications,results})
            })
           .catch((err) => {
             console.log(err);
           });


}
  return (
    <>
      <Toaster />
      <textarea
        defaultValue={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave your reply here..."
        className="input-box pl-5 resize-none placeholder:text-gray-500 h-[120px] placeholder:text-sm overflow-auto"
      ></textarea>
      <button className="btn-dark mt-5 px-10" onClick={handleComment}>
        Reply
      </button>
    </>
  );
}

export default NotificationComment