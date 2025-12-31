const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../utils/generateTokens");

// Create User
exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      employeeId,
      designation,
      phone,
      password,
      role,
    } = req.body;

    if (!name || !email || !employeeId || !phone || !password) {
      return res.status(400).json({
        message: "All required fields must be filled",
      });
    }

    const userExists = await User.findOne({
      $or: [{ email }, { employeeId }],
    });

    if (userExists) {
      return res.status(400).json({
        message: "User with this email or employeeId already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      employeeId,
      designation,
      phone,
      password: hashedPassword,
      role: role || "EMPLOYEE",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        id: user._id,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login (employee ID + Password)
exports.loginUser = async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password) {
      return res.status(400).json({
        message: "Employee ID and password are required",
      });
    }

    const user = await User.findOne({ employeeId });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        accessToken,
        user: {
          id: user._id,
          name: user.name,
          employeeId: user.employeeId,
          role: user.role,
        },
      });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh token - Renew new Access Token
exports.refreshAccessToken = async (req, res) => {
  try {
    if (!req.cookies) {
      return res.status(401).json({ message: "Cookies not found" });
    }

    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err) => {
      if (err) {
        return res.status(403).json({ message: "Refresh token expired" });
      }

      const newAccessToken = generateAccessToken(user);

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    });
  } catch (err) {
    console.error("REFRESH TOKEN ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Logout
exports.logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(200).json({ success: true });
    }

    const user = await User.findOne({ refreshToken });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully",
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

