import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import ConnectDB from "./utils/db.js"

dotenv.config()

// Routes
import authRoute from "./routes/authRoutes.js"
import userRoute from "./routes/userRoute.js"

const app = express()


const PORT = process.env.PORT || 4000


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
}
app.use(cors(corsOptions))



app.get("/", (req, res) => {
    res.send("I am coming from backend")
})


// apis
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/user", userRoute)


// Connect to DB first, then start server
ConnectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Failed to connect to DB. Server not started.");
    });