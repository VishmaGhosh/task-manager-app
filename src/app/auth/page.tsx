"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { auth, db } from "@/lib/firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utills/cn";

const signUpSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    address: z.string().min(1, "Address is required"),
    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
});

const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});



export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({ resolver: zodResolver(isLogin ? loginSchema : signUpSchema) });

    useEffect(() => {
        reset();
    }, [isLogin, reset]);

    console.log(errors);

    const onSubmit = async (data: any) => {

        try {
            console.log("Login Attempt: ", data);
            if (isLogin) {
                await signInWithEmailAndPassword(auth, data.email, data.password);
                window.location.href = "/"
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
                const user = userCredential.user;

                const userData = {
                    firstName: data.firstName || "N/A",
                    lastName: data.lastName || "N/A",
                    email: data.email,
                    address: data.address || "N/A",
                    mobile: data.mobile || "N/A",
                    uid: user.uid,
                    createdAt: new Date(),
                };

                console.log("Saving to Firestore:", userData);
                await setDoc(doc(db, "users", user.uid), userData);

                console.log("User data stored successfully!");
                setIsLogin(true);
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (!userDoc.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    firstName: user.displayName?.split(" ")[0] || "",
                    lastName: user.displayName?.split(" ")[1] || "",
                    email: user.email,
                    uid: user.uid,
                });
            }
            window.location.href = "/"
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <main className="min-h-[100vh] pt-10 pb-10 flex justify-center items-center dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative w-full h-full">

            <div className="max-w-[40rem] w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
                    {isLogin ? "Login to Your Account" : "Sign Up for Your Account"}
                </h2>

                <form className="my-8" onSubmit={handleSubmit(onSubmit)}>
                    {!isLogin && (
                        <>
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                                <LabelInputContainer className="w-full">
                                    <Label htmlFor="firstName">First Name</Label>
                                    {/* @ts-ignore */}
                                    <Input id="firstName" {...register("firstName")} />
                                     {/* @ts-ignore */}
                                    {errors.firstName && <ErrorText>{errors.firstName.message}</ErrorText>}
                                </LabelInputContainer>
                                <LabelInputContainer className="w-full">
                                    <Label htmlFor="lastName">Last Name</Label>
                                     {/* @ts-ignore */}
                                    <Input id="lastName" {...register("lastName")} />
                                     {/* @ts-ignore */}
                                    {errors.lastName && <ErrorText>{errors.lastName.message}</ErrorText>}
                                </LabelInputContainer>
                            </div>
                            <LabelInputContainer className="mb-4">
                                 {/* @ts-ignore */}
                                <Label htmlFor="address">Address</Label>
                                 {/* @ts-ignore */}
                                <Input id="address" {...register("address")} />
                                 {/* @ts-ignore */}
                                {errors.address && <ErrorText>{errors.address.message}</ErrorText>}
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-4">
                                <Label htmlFor="mobile">Mobile Number</Label>
                                 {/* @ts-ignore */}
                                <Input id="mobile" {...register("mobile")} />
                                 {/* @ts-ignore */}
                                {errors.mobile && <ErrorText>{errors.mobile.message}</ErrorText>}
                            </LabelInputContainer>
                        </>
                    )}

                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" {...register("email")} />
                        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
                    </LabelInputContainer>

                    <LabelInputContainer className="mb-8">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" {...register("password")} />
                        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
                    </LabelInputContainer>

                    <button className="bg-gradient-to-br relative group/btn from-black dark:from-orange-500 dark:to-orange-500 to-neutral-950 block dark:bg-orange-500 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--lime-950)_inset,0px_-1px_0px_0px_var(--lime-900)_inset]" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : isLogin ? "Login" : "Sign Up"}
                        <BottomGradient />
                    </button>
                </form>

                <button onClick={handleGoogleSignIn} className="bg-blue-500 w-full text-white rounded-md h-10 font-medium mt-4">
                    Sign in with Google
                    <BottomGradient />
                </button>

                <p className="text-center mt-4 cursor-pointer text-blue-600" onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                </p>
            </div>
        </main>

    );
}

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};

const ErrorText = ({ children }: { children: React.ReactNode }) => {
    return <p className="text-red-500 text-sm">{children}</p>;
};

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};
