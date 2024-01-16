import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { connectDB } from "./config/db.js";
dotenv.config();
const app = express();
const server = http.createServer(app);
const whitelist = [
    "http://localhost:5173",
    "https://tatooinetweets.netlify.app",
];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
};
app.use(cors(corsOptions));
app.use(express.json());
// Connect to the database
connectDB();
// Routes
app.get("/", (req, res) => res.send("API is running"));
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 5000;
const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (whitelist.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(new Error("Origin not allowed by CORS"));
            }
        },
    },
    pingTimeout: 60000,
});
io.on("connection", (socket) => {
    console.log("Connected to socket.io");
    socket.on("setup", (userData) => {
        if (!userData || !userData._id) {
            console.error("Invalid userData:", userData);
            return;
        }
        socket.join(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
    });
    socket.on("typing", (data) => socket.in(data.room).emit("typing", data));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
    socket.on("new message", (newMessageRecieved) => {
        const chat = newMessageRecieved.chat;
        if (!chat.users)
            return console.log("chat.users not defined");
        chat.users.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id)
                return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });
    socket.on("disconnect", () => {
        console.log("USER DISCONNECTED");
    });
});
server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
//# sourceMappingURL=index.js.map