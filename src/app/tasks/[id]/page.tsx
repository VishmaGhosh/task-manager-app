"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Spotlight } from "@/components/ui/spotlight";
import Link from "next/link";

const TaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchTask = async () => {
      if (!id || !user) return;

      try {
        // @ts-ignore
        const docRef = doc(db, "tasks", user.uid, "userTasks", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTask(docSnap.data());
        } else {
          console.error("No such task found!");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, user]);

  const handleDelete = async () => {
    if (!user || !id) return;

    const confirmDelete = confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      // @ts-ignore
      await deleteDoc(doc(db, "tasks", user.uid, "userTasks", id));
      alert("Task deleted successfully!");
      router.push("/tasks"); // Redirect to tasks list
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task.");
    }
  };

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (!task) return <p className="text-center text-red-500">Task not found!</p>;
  

  return (
    <div className="min-h-screen bg-black py-12 pt-36 text-white text-center w-full relative overflow-hidden">
      <Spotlight />
      <h1 className="text-4xl font-bold">{task.title}</h1>
      <p className="mt-4 text-lg text-gray-300 lg:px-[10rem] md:px-[1rem] px-[1rem]">{task.description}</p>

      <div className="mt-6">
        <p className="text-xl">Priority: 
          <span className={`ml-2 px-3 py-1 text-sm font-semibold text-white rounded-lg
            ${task.priority === "High" ? "bg-red-500" 
              : task.priority === "Medium" ? "bg-yellow-500" 
              : "bg-green-500"}`}>
            {task.priority}
          </span>
        </p>
      </div>

      <p className="mt-6 text-gray-400 text-sm">
        Created: {new Date(task.dueDate).toLocaleString()}
      </p>

      {/* Edit & Delete Buttons */}
      <div className="mt-10 flex justify-center space-x-6">
        <Link href={`/add-task?id=${id}`}>
          <button className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-80">
            ✏️ Edit Task
          </button>
        </Link>

        <button
          onClick={handleDelete}
          className="px-6 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-80"
        >
          🗑️ Delete Task
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;
