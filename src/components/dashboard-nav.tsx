"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { NavItem } from "@/types";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { buttonVariants } from "./ui/button";
import { ChevronDownIcon } from "lucide-react";

interface DashboardNavProps {
  items?: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Movies & Shows",
    icon: "clapperboard",
    // href: "/example",
    isChidren: true,
    children: [
      {
        title: "Movies",
        href: "/dashboard/movies",
        icon: "clapperboard",
      },
      {
        title: "Cast",
        icon: "user",
        href: "/dashboard/movies/cast",
      },
      {
        title: "Cast Roles",
        icon: "users",
        href: "/dashboard/movies/cast-roles",
      },
      {
        title: "Genres",
        icon: "drama",
        href: "/dashboard/movies/genres",
      },
      {
        title: "Tags",
        icon: "tags",
        href: "/dashboard/movies/tags",
      },
      {
        title: "Languages",
        icon: "book-a",
        href: "/dashboard/movies/languages",
      },
      {
        title: "Certificates",
        icon: "scroll-text",
        href: "/dashboard/movies/certificates",
      },
    ],
  },
  {
    title: "Campaign and Payouts",
    icon: "indian-rupee",
    // href: "/example",
    isChidren: true,
    children: [
      {
        title: "Ads",
        href: "/dashboard/ads",
        icon: "clapperboard",
      },
      {
        title: "Campaigns",
        href: "/dashboard/campaigns",
        icon: "clapperboard",
      },
    ],
  },
  {
    title: "Users",
    href: "/dashboard/users",
    icon: "user",
    label: "Users",
  },
  {
    title: "Payments History",
    href: "/dashboard/payments-history",
    icon: "circle-dollar-sign",
    label: "Payments History",
  },
  {
    title: "Payouts History",
    href: "/dashboard/payout-history",
    icon: "circle-dollar-sign",
    label: "Payout History",
  },
  {
    title: "Home Page Slider",
    href: "/dashboard/home-page-slider",
    icon: "panel-bottom-dashed",
    label: "Home Page Slider",
  },
  {
    title: "Coupons",
    href: "/dashboard/coupons",
    icon: "ticket",
    label: "Coupons",
  },
  {
    title: "Push Notifications",
    href: "/dashboard/push-notifications",
    icon: "bell",
    label: "Push Notifications",
  },
  {
    title: "Popups",
    href: "/dashboard/popups",
    icon: "maximize",
    label: "Popups",
  },
];

export function DashboardNav({
  items = NAV_ITEMS,
  setOpen,
}: DashboardNavProps) {
  const path = usePathname();

  // const [openItem, setOpenItem] = useState("");
  // const [lastOpenItem, setLastOpenItem] = useState("");

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon = Icons[item.icon || "arrowRight"];
        if (item.isChidren) {
          return (
            <Accordion
              type="single"
              collapsible
              // className="space-y-2 "
              key={item.title}
              // value={openItem}
              // onValueChange={setOpenItem}
            >
              <AccordionItem value={item.title} className="border-none ">
                <AccordionTrigger
                  className={cn(
                    "group flex hover:no-underline rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    path === item.href ? "bg-accent" : "transparent",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  <div className="flex items-center">
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="mt-2 space-y-4 pb-1 ml-4">
                  {item.children && (
                    <DashboardNav items={item.children} setOpen={setOpen} />
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        }
        return (
          <Link
            key={index}
            href={item.disabled ? "/" : item.href}
            onClick={() => {
              if (setOpen) setOpen(false);
            }}
          >
            <span
              className={cn(
                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                path === item.href ? "bg-accent" : "transparent",
                item.disabled && "cursor-not-allowed opacity-80"
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
