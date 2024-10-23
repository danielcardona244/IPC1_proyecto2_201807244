function verifyRole(roles) {
    return (req, res, next) => {
      const { userRole } = req;
      if (!roles.includes(userRole)) {
        return res.status(403).json({ message: 'No tienes los permisos necesarios.' });
      }
      next();
    };
  }
  
  module.exports = verifyRole;
  