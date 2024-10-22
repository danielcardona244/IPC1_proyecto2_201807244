const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = 'mi_secreto'; // Clave secreta para el token
const users = [
    { id: 1, username: 'admin', password: bcrypt.hashSync('admin', 10), role: 'admin' }
];

// Controlador para manejar el login
exports.login = (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, message: 'Inicio de sesión exitoso' });
};

// Middleware para proteger rutas
exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'Formato de token inválido' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Token inválido' });
        }
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};
