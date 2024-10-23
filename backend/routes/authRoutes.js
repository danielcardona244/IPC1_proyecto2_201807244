const express = require('express');
const { login, verifyToken } = require('../controllers/authController');
const verifyRole = require('../middleware/verifyRole'); // Importar el middleware de roles

const router = express.Router();

// Ruta para el login
router.post('/login', login);

// Ruta protegida para administradores
router.get('/admin', verifyToken, verifyRole(['admin']), (req, res) => {
    res.send('Bienvenido Administrador');
});

// Ruta protegida para profesores
router.get('/profesor', verifyToken, verifyRole(['profesor', 'admin']), (req, res) => {
    res.send('Bienvenido Profesor');
});

// Ruta protegida para alumnos
router.get('/alumno', verifyToken, verifyRole(['alumno', 'admin']), (req, res) => {
    res.send('Bienvenido Alumno');
});

module.exports = router;
