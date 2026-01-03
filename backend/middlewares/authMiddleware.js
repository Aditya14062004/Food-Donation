const jwt = require("jsonwebtoken");

module.exports = (roles = []) => {
  // Allow single role as string
  if (typeof roles === "string") roles = [roles];

  return (req, res, next) => {
    try {
      // 🔐 READ TOKEN FROM HTTP-ONLY COOKIE
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 🔒 ROLE-BASED ACCESS CONTROL
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = decoded; // { id, role }
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};