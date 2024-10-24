/*controladores del modulo de estudiantes
para inicio, crud y reportes*/

const XLSX = require('xlsx'); 

const cursos = [
    { codigo: '0770', nombre: 'Introducción a la Programación y Computación 1', profesor: 'Juan Perez' },
    { codigo: '0101', nombre: 'Matemática Básica 1', profesor: 'Andrea Gonzalez' }
];

const actividades = [
    {
        curso: '0770',
        nombre: 'Tarea 1',
        descripcion: 'Investigar qué es Java',
        ponderacion: 10,
        nota: 90
    },
    {
        curso: '0101',
        nombre: 'Tarea 1',
        descripcion: 'Resolver ecuaciones',
        ponderacion: 10,
        nota: 85
    }
];

// Muestra los cursos asignados al estudiante
exports.home = (req, res) => {
    const estudianteId = req.userId; // Obtener el id del estudiante autenticado
    const cursosAsignados = cursos; // Aquí debería estar la lógica para filtrar por estudiante
    res.json(cursosAsignados);
};

// Muestra las actividades y notas de un curso
exports.getCurso = (req, res) => {
    const { codigo } = req.params;
    const actividadesCurso = actividades.filter(act => act.curso === codigo);
    if (!actividadesCurso.length) {
        return res.status(404).json({ message: 'Curso no encontrado o sin actividades' });
    }
    res.json(actividadesCurso);
};

// Exportar notas del estudiante en Excel
exports.exportarNotas = (req, res) => {
    const { codigo } = req.params;
    const actividadesCurso = actividades.filter(act => act.curso === codigo);

    if (!actividadesCurso.length) {
        return res.status(404).json({ message: 'Curso no encontrado o sin actividades' });
    }

    // Crear un libro de trabajo
    const workbook = XLSX.utils.book_new();
    
    // Crear una hoja con los datos
    const worksheetData = actividadesCurso.map(act => ({
        nombre: act.nombre,
        descripcion: act.descripcion,
        ponderacion: act.ponderacion,
        nota: act.nota
    }));

    // Convertir datos a una hoja de trabajo
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    
    // Agregar la hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Notas');

    // Configurar headers para descargar el archivo Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=notas-${codigo}.xlsx`);

    // Escribir el archivo Excel a la respuesta
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.send(excelBuffer);
};

// Genera reportes de las notas del curso
exports.generarReporte = (req, res) => {
    const { codigo } = req.params;
    const actividadesCurso = actividades.filter(act => act.curso === codigo);

    if (!actividadesCurso.length) {
        return res.status(404).json({ message: 'Curso no encontrado o sin actividades' });
    }

    const notasTotales = actividadesCurso.map(act => ({
        nombre: act.nombre,
        nota: act.nota
    }));

    res.json({ notasTotales });
};
