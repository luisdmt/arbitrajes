import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import * as localforage from 'localforage';

    function Login({ onLogin }) {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
          const users = await localforage.getItem('users') || {};
          const user = users[username];

          if (user && user.password === password) {
            onLogin({ username });
          } else {
            setError('Usuario o contraseña inválidos');
          }
        } catch (err) {
          setError('Error al iniciar sesión');
        }
      };

      return (
        <div className="container">
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit">Iniciar Sesión</button>
            <Link to="/registro" className="link-button">
              Crear una cuenta
            </Link>
          </form>
        </div>
      );
    }

    export default Login;
