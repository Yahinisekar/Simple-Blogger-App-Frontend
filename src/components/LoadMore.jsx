import React from 'react'

const LoadMore = ({ state, fetchData,additionalParam }) => {
  // if(state && state.totalDocs > state.results.length){
  // if(state){
    if (
      state &&
      (state.totalDocs > state.results.length || state.results.length === 0)
    ) {
      return (
        <button
          className="text-gray-500 p-2 px-3 hover:bg-gray-300/30 rounded-md flex items-center gap-2"
          onClick={() => fetchData({...additionalParam, page: state.page + 1 })}
        >
          Load More
        </button>
      );
    } else {
      return null;
    } 
}

export default LoadMore