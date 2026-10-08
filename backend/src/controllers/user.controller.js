import status from "http-status";
import bcrypt from "bcrypt";
import Crypto from "crypto";
import { query } from "../config/db.js";

// Login user
const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(status.BAD_REQUEST).json({ message: "username and password are required" });
  }

  try {
    const userResult = await query("SELECT * FROM users WHERE username = $1", [username]);

    if (userResult.rows.length === 0) {
      return res.status(status.NOT_FOUND).json({ message: "Invalid username or password" });
    }

    const user = userResult.rows[0];

    // Check if the password matches
    const ispasswordValid = await bcrypt.compare(password, user.password);
    if (!ispasswordValid) {
      return res.status(status.UNAUTHORIZED).json({ message: "Invalid username or password" });
    }

    const token = Crypto.randomBytes(20).toString("hex");

    await query("UPDATE users SET token = $1 WHERE id = $2", [token, user.id]);

    return res.status(status.OK).json({
      message: "User successfully logged in",
      token: token,
      user: { id: user.id, username: user.username, name: user.name },
    });
  } catch (e) {
    return res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ message: `Something went wrong: ${e.message}` });
  }
};

// Register user
const register = async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(status.BAD_REQUEST).json({ message: "Name, username, and password are required" });
  }

  try {
    const existingUser = await query("SELECT id FROM users WHERE username = $1", [username]);

    if (existingUser.rows.length > 0) {
      return res
        .status(status.CONFLICT || status.FOUND)
        .json({ message: "User already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await query(
      "INSERT INTO users (name, username, password) VALUES ($1, $2, $3)",
      [name, username, hashPassword]
    );

    return res.status(status.CREATED).json({ message: "User Registered" });
  } catch (e) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
  }
};

// Get meeting activity/history
const getUserHistory = async (req, res) => {
  const { token } = req.query;
  try {
    const userResult = await query("SELECT id FROM users WHERE token = $1", [token]);
    if (userResult.rows.length === 0) {
      return res.status(status.UNAUTHORIZED).json({ message: "Invalid token" });
    }
    const userId = userResult.rows[0].id;
    const history = await query(
      "SELECT * FROM meetings WHERE user_id = $1 ORDER BY created_at DESC",
      [String(userId)]
    );
    return res.status(status.OK).json(history.rows);
  } catch (e) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
  }
};

// Add to meeting activity/history
const addToHistory = async (req, res) => {
  const { token, meeting_code } = req.body;
  try {
    const userResult = await query("SELECT id FROM users WHERE token = $1", [token]);
    if (userResult.rows.length === 0) {
      return res.status(status.UNAUTHORIZED).json({ message: "Invalid token" });
    }
    const userId = userResult.rows[0].id;
    await query(
      "INSERT INTO meetings (user_id, meeting_code) VALUES ($1, $2)",
      [String(userId), meeting_code]
    );
    return res.status(status.CREATED).json({ message: "Added code to history" });
  } catch (e) {
    return res.status(status.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
  }
};

export { register, login, getUserHistory, addToHistory };
