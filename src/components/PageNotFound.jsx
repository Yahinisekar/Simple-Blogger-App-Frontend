import React from 'react'
import pagenot from '/images/pagenot.jpg'
import blog from '/images/Designer.png'

const PageNotFound = () => {
    const handleClick = () => {
        window.location.href = '/home';
    }
  return (
    <>
      <section className="h-cover relative flex flex-col justify-center items-center p-10 gap-20">
        <img
          src={pagenot}
          className="select-none w-96 aspect-rectangle border-2 border-red-100 object-cover rounded-md"
        />
        <button className="btn-dark" onClick={handleClick}>
          Go Back to home
        </button>
        <div className="mt-auto">
          <p className="text-gray-400">
            <strong> Blog site... </strong> In this page ,you will read millions of
            stories
          </p>
        </div>
      </section>
    </>
  );
}

export default PageNotFound