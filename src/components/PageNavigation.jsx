import React, { useEffect, useRef, useState } from 'react'


export let lineRef;
export let activeTabRef;

const PageNavigation = ({ routes ,defaultActiveIndex =0,defaultHidden=[], children}) => {
     lineRef = useRef();
     activeTabRef = useRef();
    
    const [InPageNav, setInPageNav] = useState(defaultActiveIndex);

    let [isResize, setResize] = useState(false);

    let [width, setWidth] = useState(window.innerWidth);


    const handleClick = (btn, i) => {

        let { offsetWidth, offsetLeft } = btn;

        lineRef.current.style.width = offsetWidth + "px"; 
        lineRef.current.style.left = offsetLeft + "px"; 
        
        setInPageNav(i);
    }
    useEffect(() => {

        if (width > 766 && InPageNav != defaultActiveIndex) { 
            handleClick(activeTabRef.current, defaultActiveIndex);
   
        }
        
        if (!isResize) {
            window.addEventListener('resize', () => {
                if (!isResize) {
                    setResize(true);
                }
                setWidth(window.innerWidth)
         })
     }

    }, [width])
    
    // console.log(width);
    return (
      <>
        
            <div className='relative mb-8 border-b border-gray-200 flex flex-nowrap overflow-x-auto'>
                {routes.map((route, i) => {
                    return (
                        <button key={i} ref={i == defaultActiveIndex ? activeTabRef : null} className={"p-4 px-5 capitalize " + (InPageNav == i ? "text-black " : "text-red-300 ") + (defaultHidden.includes(route) ? " md:hidden " : " ")} onClick={(e) => { handleClick(e.target, i) }}>
                            {route}
                        </button>
                    )
                
                })}
            
                <hr ref={lineRef} className='absolute bottom-0 duration-300 '/>
            </div>
{/* {children} */}
            {Array.isArray(children) ? children[InPageNav] : children}
            
      </>
    );
}

export default PageNavigation