// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// async function main() {
//   // Create a new user with UUID, mobile, password, and verification status
//   const user = await prisma.user.create({
//     data: {
//       email: "test@example.com",
//       name: "Test User",
//       mobile: "1234567890", // Required field
//       password: "securePassword123", // Required field
//       verification: false, // Default to false for email verification
//     },
//   });

//   console.log("Created user:", user);

//   // Fetch all users
//   const allUsers = await prisma.user.findMany();
//   console.log("All users:", allUsers);
// }

// main()
//   .catch((e) => {
//     console.error(e);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
