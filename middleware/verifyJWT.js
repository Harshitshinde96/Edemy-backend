const jwt = require("jsonwebtoken");

// Use a valid ObjectId for the mock user ID
exports.verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    console.warn("Authorization header missing or invalid. Bypassing for testing.");
    req.userInfo = { userId: "64b8f3f2c2a1e8b9d4f0a1c2", roles: ["Student"] }; // Mock user info with a valid ObjectId
    return next();
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.warn("JWT verification failed. Bypassing for testing.");
      req.userInfo = { userId: "64b8f3f2c2a1e8b9d4f0a1c2", roles: ["Student"] }; // Mock user info with a valid ObjectId
      return next();
    }
    req.userInfo = decoded.userInfo;
    next();
  });
};

exports.isStudent = (req, res, next) => {
  try {
    if (!req.userInfo.roles.includes("Student")) {
      return res.status(401).json({
        success: false,
        message: "Protected route for students only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal error occured",
    });
  }
};

exports.isInstructor = (req, res, next) => {
  try {
    if (!req.userInfo.roles.includes("Instructor")) {
      return res.status(401).json({
        success: false,
        message: "Protected route for instructor only",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal error occured",
    });
  }
};
