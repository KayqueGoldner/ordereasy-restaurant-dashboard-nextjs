import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HintProps {
  children: React.ReactNode;
  asChild?: boolean;
  text: React.ReactNode;
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
}

export const Hint = ({
  asChild,
  children,
  text,
  className,
  side,
  sideOffset,
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent
          className={className}
          side={side}
          sideOffset={sideOffset}
        >
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
