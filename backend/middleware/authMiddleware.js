import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    // Check header
    if (!authHeader) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    // Extract token from Bearer token
    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Save user data
    req.user = decoded;

    // Continue
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
};

export default authMiddleware;