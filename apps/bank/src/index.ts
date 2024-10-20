import axios from "axios";

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const cors = require("cors");
const app = express();
const prisma = new PrismaClient();

// Apply CORS middleware
app.use(
  cors({
    origin: ["http://user-app:3000", "http://localhost:3000"], // Allow requests from your frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS for preflight
    credentials: true, // Allow cookies and credentials
  })
);

// Middleware to parse incoming JSON requests
app.use(express.json());

// Add custom middleware to handle preflight requests
app.options("*", cors()); // Allow CORS preflight for all routes

app.get("/", (req: any, res: any) => {
  res.status(200).json({ msg: "bk server" });
});

app.post("/withdraw", async (req: any, res: any) => {
  const { username, password, token, webhookUrl } = req.body;

  try {
    // Find the bank user by username and password
    const bankUser = await prisma.hDFCUser.findFirst({
      where: {
        username: username,
        password: password, // You can also check the password directly here
      },
    });

    // Check if the user exists and the password is correct
    if (!bankUser || bankUser.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Find the transaction using the token
    const trans = await prisma.bankTransaction.findUnique({
      where: {
        token: token,
      },
    });

    // Check if transaction exists
    if (!trans) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Check if the user has sufficient balance
    if (trans.amount > bankUser.accbal) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct the transaction amount from the user's account balance
    const updatedUser = await prisma.hDFCUser.update({
      where: {
        id: bankUser.id,
      },
      data: {
        accbal: {
          decrement: trans.amount, // Decrease balance
        },
      },
    });

    // Send a webhook request after the transaction is successful
    try {
      const webhookResponse = await axios.post(webhookUrl, {
        token: token,
        user_identifier: trans.userId,
        amount: trans.amount,
      });

      console.log("Webhook sent successfully", webhookResponse.data);
    } catch (webhookError) {
      console.error("Error sending webhook:", webhookError);
      return res.status(500).json({ message: "Webhook sending failed" });
    }

    // Send a response to the client that the withdrawal was successful
    res.status(202).json({
      message: "Withdrawal successful, webhook sent",
      remainingBalance: updatedUser.accbal,
    });
  } catch (err) {
    console.error("Error processing withdrawal:", err);
    return res.status(500).json({ message: "Internal server error onkar" });
  }
});

app.post("/deposit", async (req: any, res: any) => {
  const { accno, token, webhookUrl } = req.body;

  try {
    // Find the bank user by username and password
    const bankUser = await prisma.hDFCUser.findFirst({
      where: {
        accno: accno, // You can also check the password directly here
      },
    });

    // Check if the user exists and the password is correct
    if (!bankUser) {
      return res.status(401).json({ message: "Invalid user" });
    }

    // Find the transaction using the token
    const trans = await prisma.bankTransaction.findUnique({
      where: {
        token: token,
      },
    });

    // Check if transaction exists
    if (!trans) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // // Check if the user has sufficient balance
    // if (trans.amount > bankUser.accbal) {
    //   return res.status(400).json({ message: "Insufficient balance" });
    // }

    // Deduct the transaction amount from the user's account balance
    const updatedUser = await prisma.hDFCUser.update({
      where: {
        id: bankUser.id,
      },
      data: {
        accbal: {
          increment: trans.amount, // Decrease balance
        },
      },
    });

    // Send a webhook request after the transaction is successful
    try {
      const webhookResponse = await axios.post(webhookUrl, {
        token: token,
        user_identifier: trans.userId,
        amount: trans.amount,
      });

      console.log("Webhook sent successfully", webhookResponse.data);
    } catch (webhookError) {
      console.error("Error sending webhook:", webhookError);
      return res.status(500).json({ message: "Webhook sending failed" });
    }

    // Send a response to the client that the withdrawal was successful
    res.status(202).json({
      message: "deposit successful, webhook sent",
      remainingBalance: updatedUser.accbal,
    });
  } catch (err) {
    console.error("Error processing withdrawal:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
