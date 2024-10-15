"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { signupSchema } from "@/zod-schemas/Signup";
import Image from "next/image";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Use router to navigate on success

  const formMethods = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      mobile: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    try {
      setLoading(true); // Set loading state to true when API call starts
      const response = await axios.post("/api/auth/signup", values);
      if (response.data.success) {
        router.push("/signin"); // Redirect to sign-in page on success
      } else {
        alert(response.data.message); // Show error message if something goes wrong
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("An error occurred during signup. Please try again.");
    } finally {
      setLoading(false); // Set loading state to false when API call finishes
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-6 space-y-3 bg-white rounded-lg shadow-md">
        <div className="flex justify-center">
          <Avatar>
            <AvatarImage asChild src="/Payment.png">
              <Image src="/Payment.png" alt="logo" width={40} height={40} />
            </AvatarImage>
            <AvatarFallback>N</AvatarFallback>
          </Avatar>
        </div>

        <div className="text-[20px] font-bold text-center text-[#768ea7]">
          Create Account With Paytm
        </div>
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="space-y-2"
          >
            <FormField
              control={formMethods.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="ex@gmail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>
                  <FormControl>
                    <Input placeholder="mobile" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formMethods.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex pt-[10px] justify-center">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating Account" : "Sign Up"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default Signup;
