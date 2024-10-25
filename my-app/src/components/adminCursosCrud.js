import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminCursosCrud() {
  const [cursos, setCursos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar los cursos desde la API
    axios.get('http://localhost:4000/admin/cursos')
      .then((response) => {
        setCursos(response.data);
      });
  }, []);

  // Definir la función handleLogout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h2>Gestión de Cursos</h2>
      <button onClick={handleLogout}>Cerrar Sesión</button>
      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Créditos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map((curso) => (
            <tr key={curso.codigo}>
              <td>{curso.codigo}</td>
              <td>{curso.nombre}</td>
              <td>{curso.creditos}</td>
              <td>
                <button onClick={() => alert(`Editando curso: ${curso.codigo}`)}>Editar</button>
                <button onClick={() => alert(`Eliminando curso: ${curso.codigo}`)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCursosCrud;
