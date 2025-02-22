"use client";
import React, { useEffect, useState } from "react";
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";

import Link from "next/link";
import { cn } from "@/utills/cn";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";

import { auth } from "@/lib/firebaseConfig";


function Navbar({ className }: { className?: string }) {
    const [active, setActive] = useState<string | null>(null);
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    console.log(user);
    


    const getUserInitials = (name: string) => {
        const nameParts = name.split(" ");
        const firstInitial = nameParts[0]?.charAt(0) || "";
        const lastInitial = nameParts[1]?.charAt(0) || "";
        return `${firstInitial}${lastInitial}`.toUpperCase();
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = "/auth"; // Redirect to login page after logout
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    if (pathname.startsWith("/auth")) return null;
    return (
        <div className={cn("fixed top-6 sm:top-10 inset-x-4 sm:inset-x-0 w-full max-w-[100vw] sm:max-w-[95vw] md:max-w-xl lg:max-w-2xl mx-auto z-50 top-fixed-navbar", className)}>
            <Menu setActive={setActive}>
                <Link href={"/"}>
                    <MenuItem setActive={setActive} active={active} item="Home">
                    </MenuItem>
                </Link>
                <Link href={"/tasks"}>
                    <MenuItem setActive={setActive} active={active} item="My Tasks">
                    </MenuItem>
                </Link>
                <Link href={"/add-task"}>
                    <MenuItem setActive={setActive} active={active} item="Add Task">
                    </MenuItem>
                </Link>
                {/* @ts-ignore */}
                <MenuItem setActive={setActive} active={active} item="" name={getUserInitials(`${user?.firstName} ${user?.lastName}` || user?.email || "")}>
                    <div className="flex flex-col space-y-4 text-sm">
                        <HoveredLink href="">{user?.email}</HoveredLink>
                        <HoveredLink href="">{user?.firstName}{" "} { user?.lastName}</HoveredLink>
                        <HoveredLink href="">
                            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg border-2 border-orange-600 hover:bg-orange-600 transition duration-300" onClick={handleLogout}>
                                logout
                            </button>
                        </HoveredLink>
                    </div>
                </MenuItem>


            </Menu>
        </div>
    )
}

export default Navbar;