import React from 'react'
import { AnimatePresence,motion } from 'framer-motion'

const Animation = ({children,keyValue,initial={opacity:0},animate={opacity:1},transition={duration:1}}) => {
  return (
    <div>
      <AnimatePresence>
        <motion.div
          key={keyValue}
          initial={initial}
          animate={animate}
          transition={transition}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default Animation