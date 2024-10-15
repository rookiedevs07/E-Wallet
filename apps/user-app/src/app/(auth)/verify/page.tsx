"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

// Zod schema for form validation
const FormSchema = z.object({
  pin: z
    .string()
    .min(6, { message: "Your one-time password must be 6 characters." }),
});

function InputOTPForm() {
  const { data } = useSession(); // Get session data
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  // State to handle OTP generation and loading state
  const [otpGenerated, setOtpGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle OTP generation
  const handleGetOTP = async () => {
    if (!data?.user?.mobile) {
      console.error("User mobile number not found");
      return;
    }

    if (otpGenerated) {
      console.warn("OTP already generated");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `https://2factor.in/API/V1/f8e9cd16-7ef4-11ef-8b17-0200cd936042/SMS/+91${data.user.mobile}/AUTOGEN/OTP1`
      );

      if (response.data.Status !== "Success") {
        throw new Error("OTP generation failed");
      }

      const otpSessionId = response.data.Details;
      localStorage.setItem("otpSessionId", otpSessionId);
      setOtpGenerated(true); // Set OTP generated state
      console.log("OTP generated successfully");
    } catch (error) {
      console.error("Error generating OTP:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP verification
  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      const otpSessionId = localStorage.getItem("otpSessionId");

      if (!otpSessionId) {
        throw new Error("OTP session ID not found");
      }

      const verifyResponse = await axios.get(
        `https://2factor.in/API/V1/f8e9cd16-7ef4-11ef-8b17-0200cd936042/SMS/VERIFY/${otpSessionId}/${values.pin}`
      );

      if (verifyResponse.data.Status === "Success") {
        localStorage.removeItem("otpSessionId");
        const updateResponse = await axios.post("/api/auth/verify", {
          userId: data?.user.id,
        });

        if (updateResponse.data.success) {
          console.log("Verification completed successfully.");
          await signIn();
        } else {
          throw new Error("Failed to update verification status.");
        }
      } else {
        throw new Error("Wrong OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full flex justify-center max-w-md px-1 py-5 space-y-2 bg-white rounded-lg shadow-md">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your phone.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <Button type="submit">Submit</Button>
              <Button
                type="button"
                onClick={handleGetOTP}
                disabled={loading || otpGenerated}
              >
                {loading ? "Sending..." : "Get OTP"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default InputOTPForm;
