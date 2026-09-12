// components/layout/header.tsx
"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, LogOut, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [{ label: "Timesheets", href: "/dashboard" }];

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex h-14 w-full items-center justify-between border-b bg-white px-6">
      {/* Left: logo + nav */}
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="text-lg font-bold text-gray-900">
          ticktock
        </Link>

        <nav className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Right: user menu */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1 text-sm text-gray-700 outline-none">
          {session?.user?.name ?? "Account"}
          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 text-red-600 focus:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
