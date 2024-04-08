import React, { useContext } from 'react'
import Animation from '../common/Animation'
import { Toaster,toast } from 'react-hot-toast'
import { EditorContext } from './EditorPage'
import Tags from './Tags';
import axios from 'axios';
import { userContext } from '../App';
import { useNavigate, useParams } from 'react-router-dom';

let characterLimit = 200;
let tagLimit = 10;


const BlogPublish = () => {
  let navigate = useNavigate()
  let { blog_id } = useParams();
  let {
    blog: { banner, title, tags, des, content },
    setEditor,
    blog,
    setBlog,
  } = useContext(EditorContext);
  let {
    userAuth: { accessToken },
  } = useContext(userContext);
  const handleClose = () => {
    setEditor("editor");
  }
  const handleTitleChange = (e) => {
    let input = e.target
    setBlog({ ...blog, title: input.value })
  }
  const handleDesChange = (e) => {
     let input = e.target;
     setBlog({ ...blog, des: input.value });
  }
   const handleTitleKeyDown = (e) => {
     if (e.keyCode == 13) {
       e.preventDefault();
     }
  };
  const handleKeyDown = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();

      let tag = e.target.value;
      // console.log(tag);
      if (tags.length < tagLimit) {
        if (!tags.includes(tag) && tag.length) {
          setBlog({ ...blog, tags: [...tags, tag] });
        }
      }
      else {
        toast.error("Tag limit exceeded.")
      }
      e.target.value=""
    }
  }
  const publishBlog = (e) => {
    if (e.target.className.includes("disable")){
      return; 
    }
    if (!title.length) {
      return toast.error("Please enter a Title.");
    }
    if (!des.length || des.length > characterLimit) {
      return toast.error('write a short description to publish')
    }
    if (!tags.length) {
      return toast.error('Add at least one Tag');
    }
    let loadingToast = toast.loading("Loading...");
     
    e.target.classList.add('disable')
    let blogObj = {
      title,banner,des,content,tags,draft:false
    }
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {...blogObj,id:blog_id }, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    })
      .then(() => {
        e.target.classList.remove('disable');
        toast.dismiss(loadingToast);
        toast.success("Published Successfully!");
        setTimeout(() => {
          navigate("/dashboard/blogs")
        }, 500);
      }).catch(({ response })=> {
        e.target.classList.remove("disable");
        toast.dismiss(loadingToast);
         return toast.error(response.data.error)
    })
  } 
  return (
    <Animation>
      <section className="w-screen min-h-screen py-16 grid items-center lg:grid-cols-2 lg:gap-4">
        <Toaster />
        <button
          className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
          onClick={handleClose}
        >
          <i className="fa-solid fa-x"></i>
        </button>
        <div className="max-w-[550px] center">
          <p className="text-gray-400">Preview</p>

          <div className="w-full rounded-lg overflow-hidden bg-gray-300 mt-4 aspect-video">
            <img src={banner} />
          </div>
          <div className="text-4xl font-medium mt-4 line-clamp-1 leading-tight">
            {title}
          </div>
          <p className="line-clamp-2 leading-7 text-xl mt-4 ">{des}</p>
          <p className="mt-9 mb-2 text-gray-500">
            <strong> Note:</strong> Changes here will affect how your story
            appears in public places like Blog homepage and in subscribers’
            inboxes — not the contents of the story itself.
          </p>
        </div>
        <div className="lg:pl-8 lg:border-1 border-gray-400">
          <p className="mt-9 mb-2 text-gray-500">Your Blog Title</p>
          <input
            type="text"
            placeholder="Your title"
            defaultValue={title}
            className="input-box pl-4"
            onChange={handleTitleChange}
          />

          <p className="mt-9 mb-2 text-gray-500">Short Description</p>
          <textarea
            maxLength={characterLimit}
            defaultValue={des}
            className=" h-40 resize-none leading-7 input-box"
            onChange={handleDesChange}
            onKeyDown={handleTitleKeyDown}
          ></textarea>
          <p className="text-gray-500 mt-1 text-right text-sm">
            {characterLimit - des.length}/{characterLimit} characters left
          </p>
          <p className="mt-9 mb-2 text-gray-500">
            Topics-(Helps in searching and ranking your post)
          </p>
          <div className="relative input-box pl-2 py-2 pb-4">
            <input
              type="text"
              placeholder="Topic"
              className="sticky input-box bg-white top-0 mb-3 focus:bg-white"
              onKeyDown={handleKeyDown}
            />
            {tags.map((tag, i) => {
              return <Tags tag={tag} key={i} />;
            })}
          </div>
          <p className="text-gray-500 mt-1 text-right text-sm">
            {tagLimit - tags.length} tags left
          </p>
          <button className='btn-dark center' onClick={publishBlog}>Publish</button>
        </div>
      </section>
    </Animation>
  );
}

export default BlogPublish