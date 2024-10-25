import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminEstudiantesCrud() {
  const [estudiantes, setEstudiantes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar los estudiantes desde la API
    axios.get('http://localhost:4000/admin/estudiantes')
      .then((response) => {
        setEstudiantes(response.data);
      });
  }, []);

  // Definir la función handleLogout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>Gestión de Estudiantes</h2>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante) => (
            <tr key={estudiante.id}>
              <td>{estudiante.nombre}</td>
              <td>{estudiante.email}</td>
              <td>
                <button onClick={() => alert(`Editando estudiante: ${estudiante.id}`)}>Editar</button>
                <button onClick={() => alert(`Eliminando estudiante: ${estudiante.id}`)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminEstudiantesCrud;
