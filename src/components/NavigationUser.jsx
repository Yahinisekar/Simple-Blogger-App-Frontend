import React, { useContext } from 'react'
import Animation from '../common/Animation'
import { Link } from 'react-router-dom'
import { userContext } from '../App'
import { removeSession } from '../common/Session'

const NavigationUser = () => {
    const { userAuth: { name,username },setuserAuth } = useContext(userContext);
     
    const signOut = () => {
        removeSession("user");
        setuserAuth({ accessToken: null });
    }

  return (
    <>
      <Animation transition={{ duration: 0.2 }} className="absolute right-0 ">
        <div className="bg-white absolute right-0 border border-gray-200 w-60  duration-200 z-50 ">
          <Link to="/editor" className="flex link gap-2 md:hidden pl-8 py-4">
            <i className="fa-solid fa-file-pen"></i>
            <p>Write</p>
                  </Link>
                  <Link to={`/user/${name}`} className='link pl-8 py-4'>Profile</Link>
                  <Link to='/dashboard/blogs' className='link pl-8 py-4'>
                      Dashboard
                  </Link>
                  <Link to='/settings/edit-profile' className='link pl-8 py-4'>
                      Settings
                  </Link>
            <span className='absolute border-t border-gray-100 w-[100%]'></span>
                  <button className='text-left p-4 hover:bg-slate-100 w-full pl-8 py-4' onClick={signOut} >
                      <h1 className='font-bold text-xl mb-1'>Sign Out</h1>
                      <p className='text-red-300'>@{username}</p>
             </button>
        </div>
      </Animation>
    </>
  );
}

export default NavigationUser