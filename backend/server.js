import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'

import productRoutes from './routes/productRoutes.js'
import { sql } from './config/db.js'
import { aj } from "./lib/arcjet.js";

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const __dirname = path.resolve()

app.use(express.json())
app.use(cors())
app.use(helmet({
    contentSecurityPolicy: false, // secure http response headers
}))
app.use(morgan('dev')) //for logging requests

// arcjet rate-limit to all routes
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 1 });

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
              res.status(429).json({ error: "Too many requests" })
            } 
            
            else if (decision.reason.isBot()) {
                res.status(403).json({ error: "Bot access denied" })
            } 
            
            else {
                res.status(403).json({ error: "Forbidden" })
            }

            return
          }

          // check if the request is from a spoofed bot
          if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
            res.status(403).json({ error: "Spoofed bot detected" })
            return
          }

          next()
    } 
    
    catch (error) {
        console.log("Arcjet error", error)
        next(error)
    }
})

app.use("/api/products", productRoutes)

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "build", "index.html"))
    })
}

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        console.log('Database initialized successfully')
    }

    catch (error) {
        console.log( 'Error in initDB:', error)
    }
}

initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})