import { IoCalendarOutline } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import { format } from "date-fns";

import { Separator } from "@/components/ui/separator";

export const HeaderCalendar = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <IoCalendarOutline className="size-4 text-primary" />
        <p className="text-sm font-medium">
          {format(new Date(), "eee, dd MMM yyyy")}
        </p>
      </div>
      <Separator className="h-px w-5" />
      <div className="flex items-center gap-2">
        <CiClock2 className="size-4 text-primary" />
        <p className="text-sm font-medium">{format(new Date(), "HH:mm a")}</p>
      </div>
    </div>
  );
};
