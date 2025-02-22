"use client"
import Link from 'next/link';
// import { Button } from "./ui/moving-border";
import React from 'react';
import { Button } from './ui/moving-border';
import { Spotlight } from './ui/spotlight';
import { useRouter } from 'next/navigation';

function HeroSection() {

    return (
        <div className='relative overflow-hidden mx-auto py-10 md:py-0 h-auto md:h-[40rem] w-full rounded-md flex flex-col items-center justify-center'>
            <Spotlight />
            <div className='p-4 relative z-10  w-full text-center'>
                <h1 className="mt-20 md:mt-0 text-4xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">Stay on Track, Stay Productive</h1>
                <p className="mt-4 font-normal text-base md:text-lg text-neutral-300 mx-auto">
                    Effortlessly manage your tasks with a powerful Kanban-style board. Stay organized, track progress, and boost productivity with real-time updates and an intuitive drag-and-drop interface.
                </p>
                <div className='mt-4'>
                    <Link href={"/add-task"}>

                        <Button
                            borderRadius="1.5rem"
                            className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                        >
                            Create Task
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default HeroSection