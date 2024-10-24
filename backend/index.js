
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());


// importacion rutas del modulo de administrador 

const authRoutes = require('./routes/authRoutes');// ruta de login
const adminRoutes = require('./routes/adminRoutes'); // las rutas de admin para el crud de profesores
const studentRoutes = require('./routes/studentRoutes'); // rutas para crud de estudiantes
const courseRoutes = require('./routes/courseRoutes'); // rutas de cursos

// importacion rutas del modulo de profesores

const teacherRoutes = require('./routes/teacherRoutes'); //rutas de inicio y crud 

//uso de rutas del modulo admin

app.use(authRoutes); //ruta de autenticacion
app.use('/admin', adminRoutes);// ruta del crud profesores en el modulo admin
app.use('/admin/students', studentRoutes)// ruta del crud estudiantes /admin/students
app.use('/admin/course', courseRoutes); // rutas del crud cursos  /admin/cursos

// uso de rutas del modulo de profesores

app.use('/teacher', teacherRoutes); // ruta inicio y crud 

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
