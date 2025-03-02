"use client";

import { useState, useEffect } from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import { format } from "date-fns";

import { Separator } from "@/components/ui/separator";

export const HeaderCalendar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <IoCalendarOutline className="size-4 text-primary" />
        <p className="text-sm font-medium">
          {format(currentTime, "eee, dd MMM yyyy")}
        </p>
      </div>
      <Separator className="hidden h-px w-5 sm:block" />
      <div className="hidden items-center gap-2 sm:flex">
        <CiClock2 className="size-4 text-primary" />
        <p className="text-sm font-medium" suppressHydrationWarning>
          {format(currentTime, "HH:mm:ss a")}
        </p>
      </div>
    </div>
  );
};
