import { cn } from "@/lib/utils"
import Link from "next/link"

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link href="/" className={cn(
      "text-lg font-bold tracking-tighter",
      className
    )}>
      OrderEasy
    </Link>
  )
}