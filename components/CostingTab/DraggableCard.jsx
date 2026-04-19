'use client';

import { motion, useMotionValue } from 'framer-motion';
import { useRef } from 'react';

export default function DraggableCard({ data }) {
  const constraintsRef = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  return (
    <div className="relative flex items-center justify-center">
      <div
        ref={constraintsRef}
        className="relative h-[500px] w-[500px] overflow-hidden rounded-xl border border-dashed border-gray-600"
      >
        <motion.div
          drag
          dragConstraints={constraintsRef}
          dragElastic={0}
          style={{ x, y }}
          whileTap={{ cursor: 'grabbing' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-xl shadow-xl flex items-center justify-center p-4 bg-white"
        >
          <div>
          <img
            src={data[0].product_diagram}
            alt="product_diagram"
            className="max-w-[300px] max-h-[300px] object-contain"
          />
            hhee
          </div>
        </motion.div>
      </div>
    </div>
  );
}
