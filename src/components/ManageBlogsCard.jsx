import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { getFullDay } from '../common/CurrentDate';
import { userContext } from '../App';
import  axios  from 'axios';

export const ManageBlogsCard = ({ blog }) => {

  let {
    userAuth: { accessToken },
  } = useContext(userContext);

    const BlogStats = ({stats}) => {
        return (
            <div className='flex gap-2 max-lg:pb-6 border-red-200 max-lg:border-b max-lg:mb-6 '>
                {
                    Object.keys(stats).map((info, i) => {
                        return !info.includes("parent") ? <div key={i} className={'flex flex-col items-center w-full h-full justify-center p-4 px-6 ' + (i !== 0 ? " border-red-200 border-l" : "")}>
                            <h1 className='text-xl lg:text-2xl mb-2'>{stats[info].toLocaleString()}</h1>
                            <p className='max-lg:text-gray-500 capitalize'>
                                {info.split("_")[1]}
                            </p>
                        </div> : ""
                    })
                }
            </div>
        )
    }
    

    let { banner, title, blog_id, publishedAt ,activity} = blog;
    
    let [showStat, setshowStat] = useState(false);

    console.log(showStat);
    return (
      <>
        {" "}
        <div className="flex gap-10 border-b mb-6 max-md:px-4 border-red-200 pb-6 items-center">
          <img
            src={banner}
            className="max-md:hidden lg:hidden xl:block w-28 h-28 bg-gray-200 object-cover"
          />
          <div className="flex flex-col justify-between py-5 min-w-[300px]">
            <div>
              <Link
                to={`/blog/${blog_id}`}
                className="blog-title mb-4 hover:underline line-clamp-1"
              >
                {title}
              </Link>
              <p className="line-clamp-1 text-red-500">
                Published on {getFullDay(publishedAt)}
              </p>
            </div>
            <div className="flex gap-6 mt-3">
              <Link to={`/editor/${blog_id}`} className="pr-4 py-2 underline">
                <i className="fa-regular fa-pen-to-square"></i>
              </Link>

              <button
                className="lg:hidden pr-4 py-2 underline"
                onClick={() => setshowStat((preVal) => !preVal)}
              >
                <i className="fa-solid fa-chart-simple  text-green-500 "></i>
              </button>

              <button
                className="pr-4 py-2 underline text-red-600"
                onClick={(e) => deleteBlog(blog, accessToken, e.target)}
              >
                
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
          <div className="max-lg:hidden">
            <BlogStats stats={activity} />
          </div>
        </div>
        {showStat ? (
          <div className="lg:hidden">
            <BlogStats stats={activity} />
          </div>
        ) : (
          ""
        )}
      </>
    );
}

export const ManageDraftsCard = ({blog}) => {
    
  let { title, des, blog_id, index } = blog;

  let {userAuth:{accessToken}}=useContext(userContext)
  
  index++;
    return (
      <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-red-100 ">
        <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
          {index < 10 ? "0" + index : index}
        </h1>
        <div>
          <h1 className="blog-title mb-3">{title}</h1>
          <p className="line-clamp-2">
            {des.length ? des : "No Description Provided"}
          </p>
          <div className="flex gap-6 mt-3">
            <Link to={`/editor/${blog_id}`} className="pr-4 py-2">
              <i className="fa-regular fa-pen-to-square"></i>
            </Link>
                    <button className="pr-4 py-2 underline text-red-600" onClick={(e) => deleteBlog(blog,accessToken,e.target)}>
              {" "}
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    );
}

const deleteBlog = (blog, accessToken, target) => {
    

  let { index, blog_id, setStateFunc } = blog;

  target.setAttribute("disabled", true);

  axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog", { blog_id }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }).then(({ data }) => {
    target.removeAttribute("disabled")
    
    setStateFunc(preVal => {
      let { deletedCount, totalDocs, results } = preVal;
      results.splice(index, 1);

      if (!deletedCount) {
        deletedCount = 0;
      }

      if (!results.length && totalDocs - 1 > 0) {
        return null;
      }
      return { ...preVal, totalDocs: totalDocs - 1, deletedCount: deletedCount + 1, }
    })
  }).catch(err =>
    console.log(err));
}
