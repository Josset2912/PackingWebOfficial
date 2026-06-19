import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { motion, useAnimation } from "motion/react";

export const MoonIcon = forwardRef(
  ({ onMouseEnter, onMouseLeave, className, size = 20, ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    const MOON_VARIANTS = {
      normal: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: 0.3,
        },
      },
      animate: {
        pathLength: [0, 1],
        opacity: [0, 1],
        transition: {
          pathLength: { duration: 0.4, ease: "easeInOut" },
          opacity: { duration: 0.4, ease: "easeInOut" },
        },
      },
    };

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start("animate"),
        stopAnimation: () => controls.start("normal"),
      };
    });

    const handleMouseEnter = useCallback(
      (e) => {
        if (!isControlledRef.current) {
          controls.start("animate");
        }
        onMouseEnter?.(e);
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e) => {
        if (!isControlledRef.current) {
          controls.start("normal");
        }
        onMouseLeave?.(e);
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            animate={controls}
            initial="normal"
            variants={MOON_VARIANTS}
            d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
            style={{ transformOrigin: "center" }}
          />
        </svg>
      </div>
    );
  }
);

MoonIcon.displayName = "MoonIcon";
