import React, { useContext } from 'react'
import { EditorContext } from './EditorPage';

const Tags = ({ tag }) => {
  let { blog: { tags },blog,setBlog } = useContext(EditorContext)
  const handleRemove = () => {
    tags = tags.filter((t) => t !== tag);
    setBlog({...blog,tags})
  }
  
  return (
    <div className="relative p-2 mr-2 mt-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10">
      <p className="outline-none">
        {tag}
      </p>
      <button className='mt-[2px] absolute right-3 -translate-y-1/2 top-1/2 rounded-full' onClick={handleRemove}>
        
        <i className="fa-solid fa-x text-sm pointer-events-none"></i>
      </button>
    </div>
  );
}

export default Tags