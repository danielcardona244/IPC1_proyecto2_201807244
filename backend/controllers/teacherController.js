/*
controladores del modulo de profesores
del inicio, crud y reportes
 */

const cursos = [
    { codigo: '0770', nombre: 'Introducción a la Programación y Computación 1', creditos: 6, alumnos: 38, profesor: 'ECYS-P01' },
    { codigo: '0771', nombre: 'Introducción a la Programación y Computación 2', creditos: 6, alumnos: 28, profesor: 'ECYS-P01' }
];

const alumnos = []; // Aquí cargaremos los alumnos del curso

const actividades = []; // Aquí cargaremos las actividades del curso

// Muestra los cursos que imparte el profesor autenticado
exports.home = (req, res) => {
    const profesor = req.userId; // Obtener el id del profesor autenticado debe de ser req.userId
    const cursosImpartidos = cursos.filter(curso => curso.profesor === profesor);
    res.json(cursosImpartidos);
};

// Cargar alumnos al curso
exports.cargarAlumnos = (req, res) => {
    const { codigoCurso } = req.params;
    const curso = cursos.find(curso => curso.codigo === codigoCurso);

    if (!curso) {
        return res.status(404).json({ message: 'Curso no encontrado' });
    }

    const nuevosAlumnos = req.body; // El JSON con los carnets de los alumnos
    nuevosAlumnos.forEach(alumno => {
        alumnos.push({ carnet: alumno.carnet, curso: codigoCurso });
    });

    curso.alumnos += nuevosAlumnos.length;
    res.json({ message: 'Alumnos cargados exitosamente' });
};

// Cargar actividades y notas al curso
exports.cargarActividades = (req, res) => {
    const { codigoCurso } = req.params;
    const curso = cursos.find(curso => curso.codigo === codigoCurso);

    if (!curso) {
        return res.status(404).json({ message: 'Curso no encontrado' });
    }

    const actividad = req.body; // El JSON con la actividad y las notas
    actividades.push({
        curso: codigoCurso,
        nombre: actividad.nombre,
        descripcion: actividad.descripcion,
        ponderacion: actividad.ponderacion,
        notas: actividad.notas
    });

    res.json({ message: 'Actividad cargada exitosamente' });
};

// Generar reportes del curso
exports.reportes = (req, res) => {
    const { codigoCurso } = req.params;
    const curso = cursos.find(curso => curso.codigo === codigoCurso);

    if (!curso) {
        return res.status(404).json({ message: 'Curso no encontrado' });
    }

    // Obtener las notas de los estudiantes
    const notasAcumuladas = {};
    actividades.forEach(actividad => {
        if (actividad.curso === codigoCurso) {
            actividad.notas.forEach(nota => {
                if (!notasAcumuladas[nota.carnet]) {
                    notasAcumuladas[nota.carnet] = 0;
                }
                notasAcumuladas[nota.carnet] += nota.nota * (actividad.ponderacion / 100);
            });
        }
    });

    // Obtener los 5 mejores y 5 peores estudiantes
    const estudiantes = Object.entries(notasAcumuladas).map(([carnet, acumulado]) => ({ carnet, acumulado }));
    estudiantes.sort((a, b) => b.acumulado - a.acumulado);

    const mejoresEstudiantes = estudiantes.slice(0, 5);
    const peoresEstudiantes = estudiantes.slice(-5).reverse();

    res.json({ mejoresEstudiantes, peoresEstudiantes });
};
