"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  children: React.ReactNode;
  open: boolean;
  title: string;
  onOpenChange: (open: boolean) => void;
  contentClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
}

export const ResponsiveModal = ({
  children,
  onOpenChange,
  open,
  title,
  contentClassName,
  headerClassName,
  titleClassName,
}: ResponsiveModalProps) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className={contentClassName}>
          <DrawerHeader className={headerClassName}>
            <DrawerTitle className={titleClassName}>{title}</DrawerTitle>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay
        className="pointer-events-auto absolute opacity-80"
        onClick={() => onOpenChange(false)}
      />
      <DialogContent className={cn("absolute", contentClassName)}>
        <DialogHeader className={headerClassName}>
          <DialogTitle className={titleClassName}>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};
