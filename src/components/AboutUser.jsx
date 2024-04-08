import React from 'react'
import { Link } from 'react-router-dom';
import { getFullDay } from '../common/CurrentDate';

const AboutUser = ({className,bio,social_links,joinedAt}) => {
  return (
    <div className={"md:w-[90%] md:mt-7 " + className}>
      <p>{bio.length ? bio : "Nothing to read here"}</p>
      <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-gray-500">
        {Object.keys(social_links).map((key) => {
          const link = social_links[key];

          return link ? (
            <Link to={link} key={key} target="_blank">
              <i
                className={
                  "fa-brands " + (key !== "website" ? "fa-" + key : "fa-dribbble ") + " text-2xl hover:text-black text-center"
                }
              ></i>
              
            </Link>
          ) : (
            " "
          );
        })}{" "}
        
          </div>
          <p className='text-xl leading-7 text-red-400 '>Joined on {getFullDay(joinedAt) }</p>
    </div>
  );
}

export default AboutUser