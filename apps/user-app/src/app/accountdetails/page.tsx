"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useState } from "react";
import axios from "axios"; // For making HTTP requests

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { accountDetailsSchema } from "@/zod-schemas/AccountDetails";
import { zodResolver } from "@hookform/resolvers/zod";

// Define the type based on the Zod schema
type AccountDetailsForm = z.infer<typeof accountDetailsSchema>;

const AccountDetails = () => {
  const [error, setError] = useState(""); // For error handling
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Initialize form methods
  const formMethods = useForm<AccountDetailsForm>({
    resolver: zodResolver(accountDetailsSchema), // Use Zod schema for validation
    defaultValues: {
      accno: "",
    },
  });

  // Function to handle form submission
  async function onSubmit(values: AccountDetailsForm) {
    setLoading(true); // Start loading state
    setError(""); // Clear any previous errors

    try {
      // Make the request
      const response = await axios.post("http://bank-server:5001/deposit", {
        token: localStorage.getItem("offRampToken"),
        webhookUrl: "http://webhook:5000/hdfcwebhookofframp",
        accno: values.accno,
      });
      localStorage.clear();
      router.push("/transfer");
      console.log("Response:", response.data);
      // Handle success, maybe redirect the user or display a success message
    } catch (err) {
      //   console.log("onkar failed", err);
      console.error("Error during payment:", err);
      setError("Payment failed. Please try again."); // Display error message to the user
    } finally {
      setLoading(false); // End loading state
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm p-6 space-y-3 bg-white rounded-lg shadow-md">
        {/* Avatar */}
        <div className="flex justify-center">
          <Avatar>
            <AvatarImage asChild src="/Payment.png">
              <Image src="/Payment.png" alt="logo" width={40} height={40} />
            </AvatarImage>
            <AvatarFallback>N</AvatarFallback>
          </Avatar>
        </div>

        {/* Form Title */}
        <div className="text-[20px] font-bold text-center text-[#768ea7]">
          Enter Receivers Bank Details
        </div>

        {/* Form Section */}
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(onSubmit)}
            className="space-y-2"
          >
            <FormField
              control={formMethods.control}
              name="accno"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex pt-[10px] justify-center">
              <Button type="submit" disabled={loading}>
                {loading ? "Payment Processing..." : "Continue"}
              </Button>
            </div>
          </form>
        </FormProvider>

        {/* Display Error Message if Any */}
        {error && <p className="text-red-500 text-center mt-5">{error}</p>}
      </div>
    </div>
  );
};

export default AccountDetails;
