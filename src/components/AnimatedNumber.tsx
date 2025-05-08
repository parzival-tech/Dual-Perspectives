// src/components/AnimatedNumber.tsx (New File)
import React, { useEffect, useRef } from 'react';
import { motion, animate } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  formatValue?: (value: number) => string; // Optional formatter (e.g., for currency)
  className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, formatValue, className }) => {
  const nodeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (nodeRef.current) {
      const node = nodeRef.current;
      // Get the current displayed value, stripping non-numeric for parsing (e.g. '$', ',')
      const currentDisplayedValue = parseFloat(node.textContent?.replace(/[^0-9.-]+/g,"") || '0');
      
      const controls = animate(currentDisplayedValue, value, {
        duration: 0.5, // Adjust duration as needed
        ease: 'easeOut',
        onUpdate(latest) {
          if (formatValue) {
            node.textContent = formatValue(latest);
          } else {
            node.textContent = Math.round(latest).toString(); // Default to rounding
          }
        },
      });
      return () => controls.stop();
    }
  }, [value, formatValue]);

  // Initialize with the correct format for the first render
  const initialDisplayValue = formatValue ? formatValue(value) : Math.round(value).toString();

  return (
    <motion.p ref={nodeRef} className={className}>
      {initialDisplayValue}
    </motion.p>
  );
};

export default AnimatedNumber; 