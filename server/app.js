import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import ConnectDB from "./utils/db.js"


// Routes
import authRoute from "./routes/authRoutes.js"

const app = express()

dotenv.config()

const PORT = process.env.PORT || 4000


app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ credentials: true }))



app.get("/", (req, res) => {
    res.send("I am coming from backend")
})


// apis
app.use("/api/v1/user", authRoute)


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