"use client";

import { motion, MotionProps } from "framer-motion";

type AnimationVariant =
  | "fadeIn"
  | "slideUp"
  | "slideDown"
  | "slideLeft"
  | "slideRight"
  | "zoomIn"
  | "none";

type MotionWrapperProps = {
  children: React.ReactNode;
  className?: string;
  variant?: AnimationVariant;
  delay?: number;
  duration?: number;
  motionProps?: Omit<MotionProps, "children" | "className">;
};

const MotionWrapper = ({
  children,
  className = "",
  variant = "fadeIn",
  delay = 0,
  duration = 0.5,
  motionProps = {},
}: MotionWrapperProps) => {
  const initialStates: Record<AnimationVariant, any> = {
    fadeIn: { opacity: 0 },
    slideUp: { opacity: 0, y: 20 },
    slideDown: { opacity: 0, y: -20 },
    slideLeft: { opacity: 0, x: 20 },
    slideRight: { opacity: 0, x: -20 },
    zoomIn: { opacity: 0, scale: 0.95 },
    none: {},
  };

  const animateStates: Record<AnimationVariant, any> = {
    fadeIn: {
      opacity: 1,
      transition: { duration, delay, ease: "easeOut" },
    },
    slideUp: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] },
    },
    slideDown: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] },
    },
    slideLeft: {
      opacity: 1,
      x: 0,
      transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] },
    },
    slideRight: {
      opacity: 1,
      x: 0,
      transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] },
    },
    zoomIn: {
      opacity: 1,
      scale: 1,
      transition: { duration, delay, ease: [0.16, 1, 0.3, 1] },
    },
    none: {},
  };

  if (variant === "none") {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={initialStates[variant]}
      animate={animateStates[variant]}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
