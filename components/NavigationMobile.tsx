import React from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"

const menuItems = [
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Data Source",
    href: "/data-source",
    subItems: [
      { title: "2023", href: "/data-source/2023" },
      { title: "2024", href: "/data-source/2024" },
    ],
  },
  {
    title: "Counselling",
    href: "/counselling",
    subItems: [
      { title: "2023", href: "/counselling" },
      { title: "2024", href: "/counselling" },
    ],
  },
  {
    title: "Cutoffs",
    href: "/cutoffs",
  },
]

export function NavigationMobile() {
  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-[1.2rem] w-[1.2rem]" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuGroup>
            {menuItems.map((item) => (
              <React.Fragment key={item.title}>
                {item.subItems ? (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>{item.title}</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent >
                        {item.subItems.map((subItem) => (
                          <DropdownMenuItem key={subItem.title} >
                            <Link href={subItem.href}>{subItem.title}</Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ) : (
                  <DropdownMenuItem>
                    <Link href={item.href}>{item.title}</Link>
                  </DropdownMenuItem>
                )}
              </React.Fragment>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}