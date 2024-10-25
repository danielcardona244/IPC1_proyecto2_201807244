// pagina de incio, ruta "/"

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Bienvenido a ECYS</h1>
      <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo ECYS" style={{ width: '150px' }} />
      <p>
        <strong>Nombre de la aplicación:</strong> Sistema de Gestión Académica ECYS
      </p>
      <p>
        <strong>Descripción:</strong> Esta página web se dedica a la gestión académica de la
        carrera de ECYS, permitiendo a los profesores y estudiantes administrar sus cursos.
      </p>
      <h2>Acerca de:</h2>
      <p>
        Esta plataforma fue desarrollada como un proyecto académico para la gestión de cursos y
        estudiantes, facilitando el seguimiento de actividades y notas.
      </p>
      <h2>Contacto:</h2>
      <p>
        <strong>Estudiante:</strong> Daniel Cristobal Cardona Aguirre <br />
        <strong>Email:</strong> danielcardonacs@gmail.com
      </p>
      <Link to="/login">
        <button style={{ padding: '10px 20px', fontSize: '16px' }}>Ir a Login</button>
      </Link>
    </div>
  );
};

export default Home;
