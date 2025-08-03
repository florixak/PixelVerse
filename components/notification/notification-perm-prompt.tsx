"use client";

import { Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { createPortal } from "react-dom";

type NotificationPermPromptProps = {
  isSignedIn: boolean;
  unreadCount: number;
};

const NotificationPermPrompt = ({
  isSignedIn,
  unreadCount,
}: NotificationPermPromptProps) => {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [showPermissionPrompt, setShowPermissionPrompt] = useState(false);
  const [mounted, setMounted] = useState(false);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      setShowPermissionPrompt(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (unreadCount > 0 && permission === "granted" && document.hidden) {
      new Notification("PixelVerse", {
        body: `You have ${unreadCount} new notification${
          unreadCount > 1 ? "s" : ""
        }`,
        icon: "/favicon.ico",
        tag: "pixelverse-notifications",
      });
    }
  }, [unreadCount, permission]);

  useEffect(() => {
    if ("Notification" in window && isSignedIn) {
      setPermission(Notification.permission);

      if (Notification.permission === "default") {
        const timer = setTimeout(() => setShowPermissionPrompt(true), 10000);
        return () => clearTimeout(timer);
      }
    }
  }, [isSignedIn]);

  if (!showPermissionPrompt || permission === "granted" || !mounted) {
    return null;
  }

  return createPortal(
    <div className="fixed bottom-10 right-4 bg-card border rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-start gap-3">
        <div className="bg-blue-100 p-2 rounded-full">
          <Bell className="h-4 w-4 text-blue-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-sm">Stay Updated</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Get notified of new followers and interactions!
          </p>
          <div className="flex gap-2 mt-3">
            <Button
              className="cursor-pointer"
              size="sm"
              onClick={requestPermission}
            >
              Enable
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="cursor-pointer"
              onClick={() => setShowPermissionPrompt(false)}
            >
              Later
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default NotificationPermPrompt;
