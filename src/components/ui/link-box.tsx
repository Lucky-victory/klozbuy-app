import { cn } from "@/lib/utils";
import Link from "next/link";

type LinkBoxProps = {
  href?: string;
  children: React.ReactNode;
  className?: string;
};
export const LinkBox = ({ href, children, className }: LinkBoxProps) => {
  return (
    <>
      {href ? (
        <Link href={href} className={cn("block no-underline", className)}>
          {children}
        </Link>
      ) : (
        <div className={cn("relative", className)}>{children}</div>
      )}
    </>
  );
};
