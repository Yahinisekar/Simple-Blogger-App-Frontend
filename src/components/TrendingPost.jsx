import React from 'react'
import { Link } from 'react-router-dom';
import { CurrentDate } from '../common/CurrentDate';

const TrendingPost = ({ blog, index }) => {
    let {title,blog_id:id,author:{personal_info:{profile_img,name,username}},publishedAt}=blog;
  return (
      <Link to={`/blog/${id}`} className="mb-8 flex gap-5">
          <h1 className='blog-index'>{index<10 ? '0'+(index + 1) :index }</h1>
      <div className="">
        <div className="flex gap-2 items-center mb-7 ml-2">
          <img src={profile_img} className="w-6 h-6 rounded-full" />
          <p className="line-clamp-1">{name}</p>
          <p className="min-w-fit">{CurrentDate(publishedAt)}</p>
              </div>
              <h1 className='blog-title'>{title}</h1>
      </div>
    </Link>
  );
}

export default TrendingPost