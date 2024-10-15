// "use server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth";
// import prisma from "@repo/db/client";

// export async function p2pTransfer(to: string, amount: number) {
//   const session = await getServerSession(authOptions);
//   const from = session?.user?.id;
//   if (!from) {
//     return {
//       message: "Error while sending",
//     };
//   }
//   const toUser = await prisma.user.findFirst({
//     where: {
//       mobile: to,
//     },
//   });

//   if (!toUser) {
//     return {
//       message: "User not found",
//     };
//   }

//   // Start transaction
//   await prisma.$transaction(async (tx) => {
//     await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${from} FOR UPDATE`;

//     [from];
//     const fromBalance = await tx.balance.findUnique({
//       where: { userId: from },
//     });

//     // console.log(`From balance before transaction: ${fromBalance?.amount}`);

//     if (!fromBalance || fromBalance.amount < amount) {
//       throw new Error("Insufficient funds");
//     }

//     // Update balances
//     await tx.balance.update({
//       where: { userId: from },
//       data: { amount: { decrement: amount } },
//     });

//     await tx.balance.update({
//       where: { userId: toUser.id },
//       data: { amount: { increment: amount } },
//     });

//     await tx.pPTransfer.create({
//       data: {
//         fromUserId: from,
//         toUserId: toUser.id,
//         amount,
//         status: "Success",
//         timestamp: new Date(),
//       },
//     });

//     // console.log(
//     //   `Transfer successful: ${amount} transferred from ${from} to ${toUser.id}`
//     // );
//   });
// }

"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);
  const from = session?.user?.id;

  // If the session doesn't exist or user is not authenticated
  if (!from) {
    throw new Error("Unauthenticated request");
  }

  // Fetch the recipient user by mobile number
  const toUser = await prisma.user.findFirst({
    where: { mobile: to },
  });

  // If recipient is not found, throw an error
  if (!toUser) {
    throw new Error("Recipient user not found");
  }

  try {
    // Start the transaction
    await prisma.$transaction(async (tx) => {
      // Lock the sender's balance for the transaction
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${from} FOR UPDATE`;

      const fromBalance = await tx.balance.findUnique({
        where: { userId: from },
      });

      // If the sender's balance is insufficient, throw an error
      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient funds");
      }

      // Update sender's balance
      await tx.balance.update({
        where: { userId: from },
        data: { amount: { decrement: amount } },
      });

      // Update recipient's balance
      await tx.balance.update({
        where: { userId: toUser.id },
        data: { amount: { increment: amount } },
      });

      // Record successful transfer in the pPTransfer table
      await tx.pPTransfer.create({
        data: {
          fromUserId: from,
          toUserId: toUser.id,
          amount,
          status: "Success",
          timestamp: new Date(),
        },
      });
    });

    return {
      message: "Transfer successful",
    };
  } catch (error: any) {
    // If an error occurs during the transaction, log the failure in the database
    await prisma.pPTransfer.create({
      data: {
        fromUserId: from,
        toUserId: toUser.id,
        amount,
        status: "Failure", // Marking as failure
        timestamp: new Date(),
      },
    });

    // Return the error message
    return {
      message: `Transfer failed: ${error.message}`,
    };
  }
}
