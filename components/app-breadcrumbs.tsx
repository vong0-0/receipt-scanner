import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { Fragment, ReactNode } from "react";

export interface BreadcrumbItemType {
  label: ReactNode;
  href?: string;
}

interface AppBreadcrumbsProps {
  items: BreadcrumbItemType[];
  className?: string;
  separator?: ReactNode;
}

/**
 * A flexible and reusable breadcrumb component built on top of Shadcn UI.
 * It automatically handles linking for items with an `href` and
 * renders a static page for the last item or items without an `href`.
 */
export function AppBreadcrumbs({
  items,
  className,
  separator,
}: AppBreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                {item.href && !isLast ? (
                  <BreadcrumbLink asChild>
                    <Link href={item.href} className="text-[13px]">
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage className="text-[13px] font-bold text-zinc-600">
                    {item.label}
                  </BreadcrumbPage>
                )}
              </BreadcrumbItem>

              {!isLast && (
                <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
