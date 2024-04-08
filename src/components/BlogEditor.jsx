import React, { useContext, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import logo from '/images/Designer.png'
import Animation from '../common/Animation';
import bannerimage from '/images/banner.jpg'
import { uploadImage } from '../common/Aws';
import {Toaster,toast} from  'react-hot-toast';
import { EditorContext } from './EditorPage';
import EditorJS from '@editorjs/editorjs';
import { tools } from './Tools';
import axios from 'axios';
import { userContext } from '../App';


const BlogEditor = () => {
  
const navigate=useNavigate()
  const { blog, blog: { title, banner, content, tags, des }, setBlog, textEditor, setTextEditor, setEditor } = useContext(EditorContext)
  let {
    userAuth: { accessToken },
  } = useContext(userContext);

  let { blog_id } = useParams();
  
  //useEffect hook
  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holder: "textEditor",
        data: Array.isArray(content) ? content[0] : content,
        tools: tools,
        placeholder: "Start writing your story here...",
      })
    );
  }, [])
  
  const handleBanner = (e) => {
    let img = e.target.files[0];
    if (img) {
      let loadingToast = toast.loading("Uploading Image...");
      uploadImage(img).then((url) => {
        if (url) {
          toast.dismiss(loadingToast);
          toast.success("Uploaded Successfully!")
            
            
          setBlog({ ...blog, banner: url })
        }
      })
        .catch(err => {
          toast.dismiss(loadingToast);
          return toast.error('Failed to Upload Image')
        })
    }
  }
  const handleTitleKeyDown = (e) => {
    
    if (e.keyCode == 13) {
      e.preventDefault();
    }
  }
  const handleTitleChange = (e) => {
    
    let input = e.target;

    input.style.height = 'auto';
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value })

  }
  const handleImgError = (e) => {
    let img = e.target;
    img.src = bannerimage;
  }

  const handlePublish = () => {
    if (!banner.length) {
     return toast.error("Upload a blog image to Publish")
    }
    if (!title.length) {
     return toast.error("Add Title for the Blog to Publish");
    }
    if (textEditor.isReady) {
      textEditor.save().then((data) => {
        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          setEditor("publish")
        }
        else {
          return toast.error("Write something to publish...")
        }
      })
        .catch(err=>{
        console.log(err);
      })
    }
  }
  const handleDraft = (e) => {
    if (e.target.className.includes("disable")){
      return; 
    }
    if (!title.length) {
      return toast.error("Please enter a Title to save as draft.");
    }
    
    let loadingToast = toast.loading("Saving...");
     
    e.target.classList.add('disable')
    if (textEditor.isReady) {
      textEditor.save()
        .then((content) => {
          let blogObj = {
            title,
            banner,
            des,
            content,
            tags,
            draft: true,
          };
          axios
            .post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id:blog_id }, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            })
            .then(() => {
              e.target.classList.remove("disable");
              toast.dismiss(loadingToast);
              toast.success("Saved Successfully!");
              setTimeout(() => {
                navigate("/dashboard/blogs?tab=draft");
              }, 500);
            })
            .catch(({ response }) => {
              e.target.classList.remove("disable");
              toast.dismiss(loadingToast);
              return toast.error(response.data.error);
            });
        })
  
    }
    
  }
  
    return (
      <>
        <nav className="navbar">
          <Link to="/" className="flex-none w-10 ">
            <img src={logo} />
          </Link>
          <p className="max-md:hidden text-black line-clamp-1 w-full">
            {title.length ? title : "New Blog"}
          </p>
          <div className="flex gap-4 ml-auto">
            <button className="btn-dark  " onClick={handlePublish}>Publish</button>
            <button className="btn-light " onClick={handleDraft}>Draft</button>
          </div>
        </nav>
        <Toaster />
        <Animation>
          <section>
            <div className="mx-auto max-w-[900px] w-full">
              <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-gray-200">
                <label htmlFor="uploadBanner">
                  <img  src={banner} className="z-20" onError={handleImgError} alt="" />
                  <input
                    id="uploadBanner"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    hidden
                    onChange={handleBanner}
                  />
                </label>
              </div>

              <textarea
                defaultValue={title}
                placeholder="Blog Title"
                className="mt-10 text-4xl font-medium w-full h-20 outline-none resize-none leading-tight placeholder:opacity-30 bg-slate-200"
                onKeyDown={handleTitleKeyDown}
                onChange={handleTitleChange}
              ></textarea>
              <hr className='w-full opacity-80 my-5' />
              <div id="textEditor" className=''></div>
            </div>
          </section>
        </Animation>
      </>
    );
}

export default BlogEditor