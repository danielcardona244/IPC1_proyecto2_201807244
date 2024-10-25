// dashboard modulo de administrador

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes agregar la lógica para eliminar el token de autenticación
    localStorage.removeItem('token'); // Ejemplo si usas localStorage para el token
    navigate('/login'); // Redirigir al login
  };

  return (
    <div>
      <h1>Bienvenido al Panel de Administración</h1>
      <button onClick={handleLogout}>Cerrar Sesión</button> {/* Botón de cerrar sesión */}

      <div className="stats">
        <h3>Total Profesores: 10</h3>
        <h3>Total Estudiantes: 100</h3>
        <h3>Total Cursos: 5</h3>
      </div>

      <div className="admin-options">
        <h2>Opciones de Gestión</h2>
        <ul>
          <li>
            <Link to="/admin">Gestionar Profesores</Link>
          </li>
          <li>
            <Link to="/admin/estudiantes">Gestionar Estudiantes</Link>
          </li>
          <li>
            <Link to="/admin/cursos">Gestionar Cursos</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
