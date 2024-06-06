import express from "express"
import * as dotenv from "dotenv"
import { jsonParser } from "./utils/bodyParser"
import router from "./routes"
import cors from "cors"
import cookieParser from "cookie-parser";
import { createClient } from "redis"

dotenv.config()
const app = express()
// const client = createClient({
//     url: process.env.REDIS_URL
// })

app.use(
    cors({
        credentials: true,
    }),
);
app.use(cookieParser())
app.use(jsonParser)
app.use("/api", router)

app.listen(3000, () => {
    console.log("listening")
})