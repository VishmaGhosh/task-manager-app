"use client";
import Link from "next/link";
import { BackgroundGradient } from "./ui/background-gradient";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { ButtonsCard } from "./ui/tailwindcss-buttons";
import { useRouter } from "next/navigation";

interface Course {
    id: string;
    title: string;
    description: string;
    priority: string;
    dueDate: string;
    status: string;
}

function FeaturedCourses() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return;

            try {
                const userTasksRef = collection(db, `tasks/${user.uid}/userTasks`);
                const querySnapshot = await getDocs(userTasksRef);
                const taskList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Course[];

                setTasks(taskList);
            } catch (err) {
                setError("Failed to fetch tasks");
                console.error("Error fetching tasks:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user]);

    if (!user) return <p className="text-white text-center">Please log in to view tasks.</p>;
    if (loading) return <p className="text-white text-center">Loading tasks...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="py-12 bg-gray-900">
            <div className="text-center">
                <p className="text-extrabold text-3xl leading-8 text-white sm:text-4xl">Priority Task</p>
            </div>

            <div className="mt-10 px-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                    {tasks?.length > 0 && tasks.slice(0, 6).map((task: Course) => (
                        <div key={task.id} className="flex justify-center">
                            <BackgroundGradient className="flex flex-col rounded-[22px] bg-white dark:bg-zinc-900 overflow-hidden h-[200px] w-[300px] max-w-sm">
                                <div className="p-4 sm:p-6 flex flex-col items-center text-center flex-grow">
                                    <p className="text-lg sm:text-xl text-black mt-2 dark:text-neutral-200">{task.title}</p>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 w-full truncate">
                                        {task.description}
                                    </p>
                                    <Link href={`/tasks/${task.id}`} className="mt-4 text-blue-500 underline">
                                        Learn More
                                    </Link>
                                </div>
                            </BackgroundGradient>
                        </div>
                    ))}
                </div>
            </div>

            {
                tasks?.length == 0 && (
                    <ButtonsCard onClick={() => router?.push("/add-task")} className="mx-w-[30vw]">
                        <button className="p-[3px] relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                            <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                                Create A Task
                            </div>
                        </button>
                    </ButtonsCard>
                )
            }

            {tasks?.length > 0 && <div className="mt-20 text-center">
                <Link href="/tasks" className="text-white underline">
                    View all Tasks
                </Link>
            </div>}
        </div>
    );
}

export default FeaturedCourses;
