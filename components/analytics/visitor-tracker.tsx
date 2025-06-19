"use client";

import { markAsReturningVisitor } from "@/lib/visitor-detection";
import { useEffect } from "react";

const VisitorTracker = () => {
  useEffect(() => {
    const trackVisitor = async () => {
      await markAsReturningVisitor();
    };
    trackVisitor();
  }, []);
  return null;
};

export default VisitorTracker;
