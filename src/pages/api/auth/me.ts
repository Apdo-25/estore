import jwt from "jsonwebtoken";

export default async function me(req, res) {
  try {
    const token = req.cookies.auth;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
}
