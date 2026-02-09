import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex py-6 text-[10px] font-bold uppercase tracking-[0.2em]",
        className,
      )}
    >
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <li className="flex items-center gap-3">
          <Link
            href="/"
            className="text-gray-400 transition-colors hover:text-black"
          >
            Home
          </Link>
          <span className="h-1 w-1 rounded-full bg-gray-200" />
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-3">
              {item.href && !isLast ? (
                <>
                  <Link
                    href={item.href}
                    className="text-gray-400 transition-colors hover:text-black"
                  >
                    {item.label}
                  </Link>
                  <span className="h-1 w-1 rounded-full bg-gray-200" />
                </>
              ) : (
                <span className="text-black">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
