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

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken,
      refreshToken,
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
    const token = req.body.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const user = await User.findOne({ refreshToken: token });
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(403).json({
            message: "Invalid or expired refresh token",
          });
        }

        // 🔥 ONLY ACCESS TOKEN ROTATE
        const newAccessToken = generateAccessToken(user);

        return res.status(200).json({
          success: true,
          accessToken: newAccessToken,
          refreshToken: token, // 👈 SAME TOKEN
        });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Logout
exports.logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    const user = await User.findOne({ refreshToken });

    if (user) {
      user.refreshToken = null;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
