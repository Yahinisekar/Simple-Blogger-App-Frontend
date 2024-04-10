import React from 'react'

import { CurrentDate } from '../common/CurrentDate';
import { Link } from 'react-router-dom';

const BlogPost = ({ content, author }) => {
    let { publishedAt, tags, title, des, banner, activity: { total_likes }, blog_id: id } = content;
    let { profile_img, name, username } = author;
    return (
      <Link to={`/blog/${id}`} className='flex items-center border-b border-red-100 mb-4 pb-5'>
        <div className="w-full">
          <div className="flex gap-2 items-center mb-7">
            <img src={profile_img} className="w-6 h-6 rounded-full" />
            <p className="line-clamp-1">{name}</p>
            <p className="min-w-fit">{CurrentDate(publishedAt)}</p>
          </div>
          <h1 className="blog-title ml-4">{title}</h1>
          <p className="my-3 text-red-700 leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2 ml-4">
            {des}
          </p>
          <div className="flex gap-4 mt-7 ">
            <span className="btn-light py-1 px-4 text-black">{tags[0]}</span>
            <span className="flex items-center ml-3 gap-2 text-gray-500">
              <i className="fa-solid fa-hands-clapping text-xl"></i>
              {total_likes}
            </span>
          </div>
        </div>
            <div className='h-28 aspect-square bg-gray-200'>
                <img src={banner} className='w-full aspect-square h-full object-cover' />
        </div>
      </Link>
    );
}

export default BlogPost