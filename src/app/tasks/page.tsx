"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { useRouter } from "next/navigation";
import { ButtonsCard } from "@/components/ui/tailwindcss-buttons";

function Page() {
  const { user } = useAuth(); // Get logged-in user
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return; // Ensure user is logged in

      try {
        const userTasksRef = collection(db, `tasks/${user.uid}/userTasks`);
        const querySnapshot = await getDocs(userTasksRef);
        const taskList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(taskList);
      } catch (err) {
        setError("Failed to fetch tasks");
        console.error("Error fetching tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]); // Re-fetch tasks when user changes

  if (!user) return <p className="text-white text-center">Please log in to view tasks.</p>;
  if (loading) return <p className="text-white text-center">Loading tasks...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="min-h-screen bg-black py-12 pt-36">
      <h1 className="text-lg md:text-7xl text-center font-sans font-bold mb-8 text-white">
        Your Tasks ({tasks.length})
      </h1>

      <div className="flex flex-wrap justify-center">
        {tasks?.length > 0 && tasks.map((task) => (
          <CardContainer className="inter-var m-4" key={task.id} containerClassName="card-container-wrapper">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border inner-card-body">
              {/* Title */}
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                {task.title}
              </CardItem>

              {/* Priority */}
              <CardItem
                as="p"
                translateZ="60"
                className="text-sm font-medium mt-2 dark:text-neutral-300"
              >
                <span className="text-white bg-green-600 px-3 py-1 rounded-lg">
                  Priority: {task.priority}
                </span>
              </CardItem>

              {/* Description with Gradient & Fixed Height */}
              <CardItem
                translateZ="100"
                className="w-full mt-4 p-4 rounded-lg text-white text-center font-semibold 
             bg-gradient-to-r from-orange-500 to-pink-500 
             h-[80px] overflow-hidden text-ellipsis whitespace-nowrap"
              >
                {task.description}
              </CardItem>

              {/* Created Date */}
              <CardItem
                translateZ="20"
                as="p"
                className="text-xs text-gray-400 mt-2 text-center"
              >
                Due on: {new Date(task.dueDate).toLocaleDateString()}
              </CardItem>

              {/* Buttons */}
              <div className="flex justify-between items-center mt-5">
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
                  onClick={() => router.push(`/tasks/${task.id}`)}
                >
                  View Details →
                </CardItem>
                <CardItem
                  translateZ={20}
                  as="button"
                  className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
                  onClick={() => {
                    router.push(`/add-task?id=${task.id}`)
                  }}
                >
                  Edit Task
                </CardItem>
              </div>
            </CardBody>
          </CardContainer>
        ))}

      </div>
      {
        tasks?.length == 0 && (
          <div className="flex justify-center w-full">
            <ButtonsCard onClick={() => router?.push("/add-task")} className="mx-2">
              <button className="p-[3px] relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
                <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
                  Create A Task
                </div>
              </button>
            </ButtonsCard>
          </div>
        )
      }
    </div>
  );
}

export default Page;
