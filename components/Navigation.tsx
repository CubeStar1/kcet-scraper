"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const components = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Counselling",
    subItems: [
      { title: "2023", href: "/counselling/2023" },
      { title: "2024", href: "/counselling/2024" },
      { title: "Cutoffs", href: "/cutoffs" },
      { title: "Option Entry", href: "/option-entry" },
    ],
  },
  // {
  //   title: "Resources",
  //   subItems: [
  //     { title: "Downtime", href: "/downtime" },
  //     { title: "Rate Limits", href: "/rate-limits" },
  //     { title: "Suggestions", href: "/suggestions" },
  //   ],
  // },
  {
    title: "Community",
    subItems: [
      // { title: "Chat", href: "/chat" },
      { title: "Discord", href: "https://discord.gg/9ZqC3Mr5TK", external: true },
    ],
    external: true,
  },
  {
    title: "Account",
    subItems: [
      { title: "Profile", href: "/profile" },
      { title: "Dashboard", href: "/student-profile" },
    ],
  },
  // {
  //   title: "About",
  //   href: "/about",
  // },
]

export function Navigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {components.map((item) => (
          <NavigationMenuItem key={item.title}>
            {item.subItems ? (
              <>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    {item.subItems.map((subItem) => (
                      <ListItem
                        key={subItem.title}
                        title={subItem.title}
                        href={subItem.href}
                      />
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink 
                  className={navigationMenuTriggerStyle()}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.title}
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"