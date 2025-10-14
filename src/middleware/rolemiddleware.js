const roleMiddleware = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: "Access denied — insufficient permissions" });
    }

    next();
  };
};

export default roleMiddleware;