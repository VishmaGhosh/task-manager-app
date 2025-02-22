"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { db } from "@/lib/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select } from "./ui/select";
import { v4 as uuidv4 } from "uuid";

// Define Zod Schema for Validation
const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "Priority must be Low, Medium, or High" }),
  }),
  status: z.enum(["To Do", "In Progress", "Done"], {
    errorMap: () => ({ message: "Status must be To Do, In Progress, or Done" }),
  }),
});

export function AddTask() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const taskId = searchParams.get("id"); // Get ID from URL
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(taskSchema),
  });

  // Fetch Task Data if Editing
  useEffect(() => {
    if (!taskId || !user) {
      setLoading(false);
      return;
    }

    const fetchTask = async () => {
      try {
        const docRef = doc(db, "tasks", user.uid, "userTasks", taskId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const taskData = docSnap.data();
          setValue("title", taskData.title);
          setValue("description", taskData.description);
          setValue("dueDate", taskData.dueDate);
          setValue("priority", taskData.priority);
          setValue("status", taskData.status);
        } else {
          console.error("Task not found.");
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId, user, setValue]);

  // Handle Submit
  const onSubmit = async (data: any) => {
    if (!user) return;

    try {
      const newTaskId = taskId || uuidv4(); // Generate ID if new task
      const taskRef = doc(db, "tasks", user.uid, "userTasks", newTaskId);

      await setDoc(taskRef, data, { merge: true });

      alert(taskId ? "Task updated successfully!" : "Task added successfully!");
      router.push("/tasks");
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task.");
    }
  };

  if (loading) return <p className="text-center text-white">Loading...</p>;

  return (
    <div className="w-full max-w-[95vw] sm:max-w-[90vh] lg:max-w-[70vw] mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white/30 dark:bg-black/50">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        {taskId ? "Edit Task" : "Add a New Task"}
      </h2>

      <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
        {/* Title */}
        <div className="mb-4">
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Task Title" {...register("title")} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div className="mb-4">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Enter Description..." {...register("description")} />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        {/* Due Date */}
        <div className="mb-4">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
          {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
        </div>

        {/* Priority */}
        <div className="mb-4">
          <Label htmlFor="priority">Priority</Label>
          <Select id="priority" {...register("priority")} className="w-full p-2 border rounded-md">
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>
          {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
        </div>

        {/* Status */}
        <div className="mb-10">
          <Label htmlFor="status">Status</Label>
          <Select id="status" {...register("status")} className="w-full p-2 border rounded-md">
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </Select>
          {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-gradient-to-br relative group/btn from-black dark:from-lime-950 dark:to-lime-950 to-neutral-950 block dark:bg-lime-950 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--lime-950)_inset,0px_-1px_0px_0px_var(--lime-900)_inset]"
        >
          {isSubmitting ? "Saving..." : taskId ? "Update Task" : "Submit Task"}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

// Bottom Gradient Effect
const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
);
