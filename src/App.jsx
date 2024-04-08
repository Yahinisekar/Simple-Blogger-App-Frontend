import React, { createContext, useEffect, useState } from 'react'
import Navbar from './components/Navbar';
import { Route, Routes } from 'react-router-dom';
import UserForm from './components/UserForm';
import { getSession } from './common/Session';
import EditorPage from './components/EditorPage';
import HomePage from './Pages/HomePage';
import EntrancePage from './Pages/EntrancePage';
import SearchPage from './Pages/SearchPage';
import PageNotFound from './components/PageNotFound';
import ProfilePage from './Pages/ProfilePage';
import BlogPage from './Pages/BlogPage';
import SideNavbar from './components/SideNavbar';
import ChangePassword from './components/ChangePassword';
import EditProfile from './components/EditProfile';
import NotificationPage from './Pages/NotificationPage';
import ManageBlogs from './Pages/ManageBlogs';


//create a context
export const userContext = createContext({})

const App = () => {
  //use state to keep track of the current user and setUser function
  const [userAuth, setuserAuth] = useState({})
  
  useEffect(() => {
    let userInSession = getSession("user");
    userInSession ?  setuserAuth(JSON.parse(userInSession)) : setuserAuth({accessToken:null})
  }, [])
  
  return (
    //provide the userContext with the value of the userAuth and setUser function
    <>
      <userContext.Provider value={{ userAuth, setuserAuth }}>
        <Routes>
          <Route path="/editor" element={<EditorPage />} />
          <Route path="/editor/:blog_id" element={<EditorPage />} />
          <Route path="/" element={<Navbar />}>
            <Route index element={<EntrancePage />} />
            <Route path="/home" element={<HomePage />} />

            <Route path="dashboard" element={<SideNavbar />}>
              <Route path="blogs" element={<ManageBlogs/> } />
              <Route path="notifications" element={<NotificationPage />} />
            </Route>
            
            <Route path="settings" element={<SideNavbar />}>
              <Route path="edit-profile" element={<EditProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>
            <Route path="login" element={<UserForm type="login" />} />
            <Route path="signup" element={<UserForm type="sign-up" />} />
            <Route path="search/:query" element={<SearchPage />} />
            <Route path="blog/:blog_id" element={<BlogPage />} />
            <Route path="user/:id" element={<ProfilePage />} />

            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </userContext.Provider>
    </>
  );
}

export default App