import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { getFullDay } from "../common/CurrentDate";
import NotificationComment from "./NotificationComment";
import { userContext } from "../App";
import axios from "axios";

const NotificationCard = ({ data, index, notificationState }) => {
  let [isReply, setIsReply] = useState(false);
  let {
    type,
    seen,
    reply,
    createdAt,
    comment,
    replied_on_comment,
    user,
    user: {
      personal_info: { name, username, profile_img },
    },
    blog: { _id, blog_id, title },
    _id: notification_id,
  } = data;

  let {
    userAuth: {
      name: author_username,
      profile_img: author_profile_img,
      accessToken,
    },
  } = useContext(userContext);

  let {
    notifications,
    notifications: { results, totalDocs },
    setNotifications,
  } = notificationState;

  const handleReply = () => {
    setIsReply((prevVal) => !prevVal);
  };

  const handleDelete = (comment_id, type, target) => {
    // Disable the delete button to prevent multiple clicks
    target.setAttribute("disabled", true);

    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment",
        { _id: comment_id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then(() => {
        // Update the notifications state after successful deletion
        const updatedResults = [...results];
        if (type === "comment") {
          updatedResults.splice(index, 1);
        } else {
          updatedResults[index].reply = null; // Remove reply from the notification
        }
        setNotifications({
          ...notifications,
          results: updatedResults,
          totalDocs: totalDocs - 1,
          deletedCount: notifications.deletedCount + 1,
        });

        // Enable the delete button after successful deletion
        target.removeAttribute("disabled");
      })
      .catch((err) => {
        console.log(err);
        // Enable the delete button in case of an error
        target.removeAttribute("disabled");
      });
  };

  return (
    <div className={"p-6 border-b border-gray border-l-red-400 " +(!seen ? "border-l-2" : "" ) }>
      <div className="flex gap-5 mb-3">
        <img src={profile_img} className="w-14 h-14 flex-none rounded-full" />
        <div className="w-full ">
          <h1 className="font-medium text-xl text-gray-500">
            <span className="lg:inline-block hidden capitalize">
              {username}
            </span>
            <Link to={`/user/${name}`} className="mx-1 text-black underline">
              @{name}
            </Link>
            <span className="font-normal">
              {type == "like"
                ? "liked your blog"
                : type == "comment"
                ? "commented on your post"
                : "replied on your post"}
            </span>
          </h1>
          {type == "reply" ? (
            <div className="p-4 mt-4 rounded-md bg-red-100/30  ">
              <p>{replied_on_comment?.comment}</p>
            </div>
          ) : (
            <Link
              to={`/blog/${blog_id}`}
              className="font-medium text-gray-500 hover:underline line-clamp-1 mt-2"
            >{`"${title}"`}</Link>
          )}
        </div>
      </div>
      {type !== "like" && comment && (
        <p className="ml-14 pl-5 text-md my-5">{comment?.comment}</p>
      )}

      <div className="ml-14 max-sm:ml-10 pl-5 mt-3 text-red-400 flex gap-8">
        <p>{getFullDay(createdAt)}</p>
        {type !== "like" ? (
          <>
            {!reply ? (
              <button
                className="underline text-gray-500 hover:text-black"
                onClick={handleReply}
              >
                Reply
              </button>
            ) : (
              ""
            )}
            <button
              className="underline text-gray-500 hover:text-red-500"
              onClick={(e) => {
                handleDelete(comment?._id, "comment", e.target);
              }}
            >
              Delete
            </button>
          </>
        ) : (
          ""
        )}
      </div>
      {isReply ? (
        <div className="mt-8">
          <NotificationComment
            _id={_id}
            blog_author={user}
            index={index}
            replyingTo={comment?._id}
            setIsReply={setIsReply}
            notification_id={notification_id}
            notificationData={notificationState}
          />
        </div>
      ) : (
        ""
      )}
      {reply ? (
        <div className="ml-20 p-5 bg-red-100/30 mt-5 rounded-md">
          <div className="flex gap-3 mb-3">
            <img src={author_profile_img} className="w-8 h-8 rounded-full" />

            <div>
              <h1 className="font-medium text-xl text-gray-500">
                <Link
                  to={`/user/${author_username}`}
                  className="mx-1 text-black underline"
                >
                  @{author_username}
                </Link>
                <span className="font-normal">replied to</span>
                <Link
                  to={`/user/${name}`}
                  className="mx-1 text-black underline"
                >
                  @{name}
                </Link>
              </h1>
            </div>
          </div>

          <p className="ml-14 text-md my-2">{reply?.comment}</p>
          <button
            className="underline text-gray-500 hover:text-red-500 ml-14 mt-2"
            onClick={(e) => {
              handleDelete(comment?._id, "reply", e.target);
            }}
          >
            Delete
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default NotificationCard;
