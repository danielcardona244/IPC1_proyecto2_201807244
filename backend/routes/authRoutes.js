const express = require('express');
const { login, verifyToken } = require('../controllers/authController');

const router = express.Router();

// Ruta para el login
router.post('/login', login);

// Ruta protegida de ejemplo
router.get('/admin', verifyToken, (req, res) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Acceso denegado' });
    }
    res.send('Bienvenido Administrador');
});

module.exports = router;  // Asegúrate de que el router esté exportado correctamente
