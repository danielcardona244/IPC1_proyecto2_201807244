// Middleware para verificar el rol del usuario
const verifyRole = (rolesPermitidos) => {
    return (req, res, next) => {
        const userRole = req.userRole; // Rol del usuario del token JWT
        
        // Verificar si el rol del usuario está en la lista de roles permitidos
        if (!rolesPermitidos.includes(userRole)) {
            return res.status(403).json({ message: 'Acceso denegado: no tienes los permisos necesarios' });
        }
        next(); // Permitir el acceso si el rol es correcto
    };
};

module.exports = verifyRole;  // Exportar la función correctamente
