import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";
import "dotenv/config"

// init arcjet
export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE",
      ],
    }),
    // rate limiting
    tokenBucket({
      mode: "LIVE",
      refillRate: 30,
      interval: 5,
      capacity: 20,
    }),
  ],
})