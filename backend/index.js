
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());


//rutas
const authRoutes = require('./routes/authRoutes');// ruta de login

const adminRoutes = require('./routes/adminRoutes'); // las rutas de admin para el crud de profesores

const studentRoutes = require('./routes/studentRoutes'); // rutas para crud de estudiantes

const courseRoutes = require('./routes/courseRoutes'); // Importar las rutas de cursos

//uso de rutas 
app.use(authRoutes); //ruta de autenticacion

app.use('/admin', adminRoutes);// agregar las ruta de admin para el crud de profesores

app.use('/admin/students', studentRoutes)// agregar las ruta de estudiantes para el crud de estudiantes en admin

app.use('/admin/course', courseRoutes); // Agregar las rutas de cursos

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
