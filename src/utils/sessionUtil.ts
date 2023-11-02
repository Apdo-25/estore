import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { NextApiRequest } from "next";

export const getSessionId = (req?: NextApiRequest): string => {
  try {
    let sessionId;

    if (req) {
      // Server-side context
      sessionId = req.cookies["session-id"];
    } else {
      // Client-side context
      sessionId = Cookies.get("session-id");
    }

    // If session-id doesn't exist, create a new one
    if (!sessionId) {
      sessionId = uuidv4();

      // Set the session-id in the cookies with an expiration of 30 days and secure flag
      Cookies.set("session-id", sessionId, {
        expires: 30,
        secure: true,
        sameSite: "Strict",
      });
    }

    // Return the session-id
    return sessionId;
  } catch (error) {
    console.error("Error retrieving/setting session-id:", error);
    throw new Error("Failed to retrieve or set session ID.");
  }
};
