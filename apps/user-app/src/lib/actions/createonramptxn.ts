// "use server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth";
// import prisma from "@repo/db/client";

// export async function createOnRampTxn(amt: number, provider: string | "") {
//   const session = await getServerSession(authOptions);
//   if (!session?.user || !session.user?.id) {
//     return {
//       message: "Unauthenticated request",
//     };
//   }

//   const token = Math.random().toString();

//   await prisma.onRampTransaction.create({
//     data: {
//       provider,
//       status: "Pending",
//       startTime: new Date(),
//       token: token,
//       userId: session?.user?.id,
//       amount: amt,
//     },
//   });

//   return {
//     message: "Done",
//   };
// }

"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import { revalidatePath } from "next/cache";

export async function createOnRampTxn(amt: number, provider: string) {
  if (amt <= 0) {
    return {
      msg: "Amount Cannot be Insignificant",
    };
  }
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }

  const token = Math.random().toString();

  await prisma.bankTransaction.create({
    data: {
      provider,
      status: "Pending",
      startTime: new Date(),
      token: token,
      userId: session?.user?.id,
      amount: amt,
    },
  });

  // Revalidate the path where the transactions are shown (adjust the path if necessary)
  revalidatePath("/transfer");

  return {
    message: "Done",
    transToken: token,
  };
}
