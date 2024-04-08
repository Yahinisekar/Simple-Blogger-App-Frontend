import React, { useEffect, useState } from "react";
import Animation from "../common/Animation";
import PageNavigation from "../components/PageNavigation";
import Loader from "../components/Loader";
import axios from "axios";
import BlogPost from "../components/BlogPost";
import TrendingPost from "../components/TrendingPost";
import { lineRef } from "../components/PageNavigation";
import { activeTabRef } from "../components/PageNavigation";
import NoData from "../components/NoData";
import { FilterPagination } from "../common/FilterPagination";
import LoadMore from "../components/LoadMore";

const HomePage = () => {
  let [blogs, setBlogs] = useState(null);
  let [trendingBlogs, setTrendingBlogs] = useState(null);
  let [pageState, setPageState] = useState("home");
  let categories = [
    "programming",
    "social media",
    "reactjs",
    "nodejs",
    "expressjs",
    "javascript",
  ];

  //function to fetch latest blogs
  let fetchLatestBlogs = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blog", { page })
      .then(async ({ data }) => {
        let formatData = await FilterPagination({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/all-latest-blog-count",
        });
        setBlogs(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //function to fetch trending blogs
  let fetchTrendingBlogs = () => {
    axios
      .get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blog")
      .then(({ data }) => {
        setTrendingBlogs(data.blogs);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //fetching blogs by category
  const fetchByCategory = ({ page = 1 }) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
        tag: pageState,
        page,
      })
      .then(async ({ data }) => {
        let formatData = await FilterPagination({
          state: blogs,
          data: data.blogs,
          page,
          countRoute: "/search-blogs-count",
          data_to_send: { tag: pageState },
        });
        setBlogs(formatData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //function to handle the button when it is clicked
  let handleClick = (e) => {
    let category = e.target.innerText.toLowerCase();
    setBlogs(null);

    if (pageState === category) {
      setPageState("home");
      return;
    } else {
      setPageState(category);
    }
  };

  //useEffect hook for calling functions on component mount and update
  useEffect(() => {
    activeTabRef.current.click();
    if (pageState === "home") {
      fetchLatestBlogs({ page: 1 });
    } else {
      fetchByCategory({ page: 1 });
    }
    if (!trendingBlogs) {
      fetchTrendingBlogs();
    }
  }, [pageState]);

  return (
    <Animation>
      <section className="h-cover flex justify-center gap-10">
        {/* main section for the content */}
        <div className="w-full">
          <PageNavigation
            routes={[pageState, "trending blogs"]}
            defaultHidden={["trending blogs"]}
          >
            <>
              {/* show loading spinner if there are no blog posts yet */}
              {blogs == null ? (
                <Loader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => (
                  <Animation
                    key={i}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  >
                    <BlogPost
                      content={blog}
                      author={blog.author.personal_info}
                    />
                  </Animation>
                ))
              ) : (
                <NoData message="Not published yet" />
              )}
              {/* <LoadMore
                state={blogs}
                fetchData={
                  pageState === "home" ? fetchLatestBlogs : fetchByCategory
                }
              /> */}
            </>
            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => (
                <Animation key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                  <TrendingPost blog={blog} index={i} />
                </Animation>
              ))
            ) : (
              <NoData message="No trending blogs published yet" />
            )}
          </PageNavigation>
        </div>
        {/* Trending blogs */}
        <div className="min-w-[40%] lg:min-w-[400px] max-w-min border-l border-gray-200 pl-8 pt-3 max-md:hidden">
          <div className="flex flex-col gap-10">
            <h1 className="font-medium text-xl mb-0">Recommended Topics</h1>
            <div className="flex gap-3 flex-wrap mb-3">
              {categories.map((category, i) => {
                return (
                  <button
                    onClick={handleClick}
                    className={
                      "tag " + (pageState === category ? " bg-red-400 " : "")
                    }
                    key={i}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <h1 className="font-medium text-xl mb-8 mt-3">
              Up-and-coming{" "}
              <i className="fa-solid fa-fire-flame-curved text-orange-500"></i>
            </h1>
            {trendingBlogs == null ? (
              <Loader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => (
                <Animation key={i} transition={{ duration: 1, delay: i * 0.1 }}>
                  <TrendingPost blog={blog} index={i} />
                </Animation>
              ))
            ) : (
              <NoData message="Not published yet" />
            )}
          </div>
        </div>
      </section>
    </Animation>
  );
};

export default HomePage;
