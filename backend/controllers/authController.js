//controlador de auntenticador 

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET_KEY = 'mi_secreto';

const users = [
    { id: 1, username: 'admin', password: bcrypt.hashSync('admin', 10), role: 'admin' },
    { id: 2, username: 'profesor', password: bcrypt.hashSync('profesor_password', 10), role: 'profesor' },
    { id: 3, username: 'nombreEstudiante', password: bcrypt.hashSync('passwordEstudiante', 10), role: 'student' }
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
