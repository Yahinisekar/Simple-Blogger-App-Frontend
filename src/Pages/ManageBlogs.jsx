import React, { useContext, useEffect, useState } from 'react'
import Animation from '../common/Animation'
import axios from 'axios';
import { userContext } from '../App';
import { FilterPagination } from '../common/FilterPagination';
import { Toaster } from 'react-hot-toast';
import PageNavigation from '../components/PageNavigation';
import Loader from '../components/Loader';
import NoData from '../components/NoData';
import {ManageBlogsCard,  ManageDraftsCard } from '../components/ManageBlogsCard';
import LoadMore from '../components/LoadMore';
import { useSearchParams } from 'react-router-dom';
// import ManagedraftsCard from '../components/ManagedraftsCard';

const ManageBlogs = () => {



  const [blogs, setBlogs] = useState(null);
  const [drafts, setDrafts] = useState(null);
  const [query, setQuery] = useState("");

  let activeTab =useSearchParams()[0].get("tab")

  let {
    userAuth: {accessToken},
  } = useContext(userContext);

  const getBlogs=({page,draft,deletedCount = 0}) => {
     
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + '/user-written-blogs', {
      page,draft,query,deletedCount
    }, {
      headers: {
        'Authorization':`Bearer ${accessToken}`
      }
    }).then(async ({ data }) => {

      let formatedData =await FilterPagination({
        state: draft ? drafts : blogs,
        data: data.blogs,
        page,
        user: accessToken,
        countRoute: '/user-written-blogs-count',
        data_to_send:{draft,query}
      })
      if (draft) {

        console.log("draft",formatedData)
         setDrafts(formatedData)
      } else {
         setBlogs(formatedData);
      }
     })
      .catch(err => {
        console.log(err);
      })
    

  }

  useEffect(() => {
    if (accessToken) {
      if (blogs == null) {
        getBlogs({ page: 1, draft: false });
      }
      if (drafts == null) {
        getBlogs({ page: 1, draft: true })
      }
    }
       
  }, [accessToken, blogs, drafts, query]);


  const handleChange = (e) => {
    
    if (!e.target.value.length) {
        
      setQuery('');

      setBlogs(null);
      setDrafts(null);
      }


  }

  const handleSearch = (e) => {
    
    let searchQuery = e.target.value;

    setQuery(searchQuery);

    if (e.keyCode == 13 && searchQuery.length) {
      
      setBlogs(null);

      setDrafts(null);
    }

  }

  return (
    <Animation>
      <h1 className="max-md:hidden">Manage Blogs</h1>
      <Toaster />
      <div className="relative max-md:mt-0 md:mt-8 mb-10">
        <input
          type="search"
          className="w-full bg-gray-300 p-4 pl-12 pr-6 rounded-full placeholder:text-gray-100"
          placeholder="search blogs"
          onChange={handleChange}
          onKeyDown={handleSearch}
        />
        <i className="fa-solid fa-magnifying-glass absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-gray-500 "></i>
      </div>

      <PageNavigation routes={["Published Blogs", "Drafts"]} defaultActiveIndex={activeTab != 'draft' ? 0 : 1}>
        {
          //published blogs

          blogs == null ? (
            <Loader />
          ) : blogs.results.length ? (
            <>
              {blogs.results.map((blog, i) => {
                return (
                  <Animation key={i} transition={{ delay: i * 0.04 }}>
                    <ManageBlogsCard
                      blog={{ ...blog, index: i, setStateFunc: setBlogs }}
                    />
                  </Animation>
                );
              })}

              <LoadMore
                state={blogs}
                fetchData={getBlogs}
                additionalParam={{
                  draft: false,
                  deletedCount: blogs.deletedCount,
                }}
              />
            </>
          ) : (
            <NoData message="No published blogs" />
          )
        }
        {
          //Draft blogs

          drafts == null ? (
            <Loader />
          ) : drafts.results.length ? (
            <>
              {drafts.results.map((blog, i) => {
                return (
                  <Animation key={i} transition={{ delay: i * 0.04 }}>
                    <ManageDraftsCard
                      blog={{ ...blog, index: i, setStateFunc: setDrafts }}
                    />
                  </Animation>
                );
              })}
              <LoadMore
                state={drafts}
                fetchData={getBlogs}
                additionalParam={{
                  draft: true,
                  deletedCount: drafts.deletedCount,
                }}
              />
            </>
          ) : (
            <NoData message="No drafts" />
          )
        }
      </PageNavigation>
    </Animation>
  );
}

export default ManageBlogs