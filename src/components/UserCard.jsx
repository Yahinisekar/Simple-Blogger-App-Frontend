import React from 'react'
import { Link } from 'react-router-dom';
import UserForm from './UserForm';

const UserCard = ({ user }) => {
    
    let { personal_info: { name, username, profile_img } } = user;
  return (
    <Link to={`/user/${name}`} className="flex gap-5 items-center mb-5">
      <img src={profile_img} className="w-14 h-14 rounded-full" />
      <div>
              <h1 className="font-medium text-xl line-clamp-2">{name}</h1>
              <p className='text-gray-500'>@{username}</p>
      </div>
    </Link>
  );
}

export default UserCard