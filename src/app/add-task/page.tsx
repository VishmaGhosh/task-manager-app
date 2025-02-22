import { AddTask } from '@/components/AddTask';
import { BackgroundBeams } from '@/components/ui/background-beams';
import React from 'react'

function AddTaskPage() {
    return (
        <div className="h-full w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
            <div className='z-[9] w-[80rem] mt-[8rem] mb-[4rem] add-task-wrapper-layout'>
                <AddTask />
            </div>

            <BackgroundBeams />
        </div>
    )
}

export default AddTaskPage;