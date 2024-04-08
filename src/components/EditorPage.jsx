import React, { createContext, useContext, useEffect, useState } from 'react'
import { userContext } from '../App'
import { Navigate, useParams } from 'react-router-dom'
import BlogEditor from './BlogEditor'
import BlogPublish from './BlogPublish'
import Loader from './Loader'
import axios from 'axios'


const blogStructure = {
  title: '',
  banner: '',
  content: [],
  tags: [],
  des: '',
  author:{personal_info:{}}
}
export const EditorContext = createContext({});

const EditorPage = () => {
  //useState to manage the state component
  
  const { blog_id } =useParams()
  const [blog,setBlog]=useState(blogStructure)
    const[editor,setEditor]=useState("editor")
  const [textEditor, setTextEditor] = useState({ isReady: false })
  
  const [loading, setLoading] = useState(true);
    //using useContext hook
  const { userAuth: { accessToken } } = useContext(userContext);
  
  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id, draft: true, mode: 'edit' }).then(({ data: { blog } }) => {
      setBlog(blog);
      setLoading(false);
    })
      .catch(err => {
        setBlog(null);
        setLoading(false);
    })
  },[])

  return (
    <EditorContext.Provider
      value={{ blog, setBlog, editor, setEditor, textEditor, setTextEditor }}
    >
      {accessToken === null ? (
        <Navigate to="/login" />
      ) :
        loading ? <Loader/>:
        editor == "editor" ? (
        <BlogEditor />
      ) : (
        <BlogPublish />
      )}
    </EditorContext.Provider>
  );
}

export default EditorPage