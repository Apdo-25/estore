import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

export const getSessionId = (): string => {
  let sessionId = Cookies.get("sessionId");
  if (!sessionId) {
    sessionId = uuidv4();
    Cookies.set("sessionId", sessionId);
  }
  return sessionId;
};
