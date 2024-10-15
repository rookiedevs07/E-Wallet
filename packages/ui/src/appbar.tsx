"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./button";
import Image from "next/image";
declare module "next-auth" {
  export interface Session {
    user: {
      id: string;
      username: string;
      mobile: string;
      verification: boolean;
    };
  }
}

export const AppBar = () => {
  const { data: session } = useSession();
  console.log(session);
  const router = useRouter();
  return (
    <div className="flex justify-between border-b px-4 items-center h-[60px]">
      <div className="flex gap-3 items-center justify-center">
        <Avatar>
          <AvatarImage asChild src="/Payment.png">
            <Image src="/Payment.png" alt="logo" width={40} height={40} />
          </AvatarImage>
          <AvatarFallback>N</AvatarFallback>
        </Avatar>
        <div className="text-lg flex justify-center">PayTM</div>
      </div>

      <div className="flex gap-5 items-center ">
        <div className="font-bold text-[18px]">{session?.user?.username}</div>
        <Button
          className="w-[80px] bg-[#3779b8] py-[5px] text-[white] rounded-md text-[16px] flex items-center justify-center text-center"
          onClick={
            session
              ? () => signOut({ callbackUrl: "/signin" })
              : () => router.replace("/signin")
          }
        >
          {session ? "Logout" : "Login"}
        </Button>
      </div>
    </div>
  );
};
