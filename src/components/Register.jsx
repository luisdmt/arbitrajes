import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import * as localforage from 'localforage';

    function Register({ onRegister }) {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [error, setError] = useState('');
      const navigate = useNavigate();

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
          setError('Las contraseñas no coinciden');
          return;
        }

        try {
          const users = await localforage.getItem('users') || {};
          if (users[username]) {
            setError('El usuario ya existe');
            return;
          }

          users[username] = { password };
          await localforage.setItem('users', users);
          onRegister({ username });
        } catch (err) {
          setError('Error al registrar');
        }
      };

      return (
        <div className="container">
          <h2>Registro</h2>
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
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit">Registrar</button>
            <Link to="/" className="link-button">
              ¿Ya tienes una cuenta?
            </Link>
          </form>
        </div>
      );
    }

    export default Register;
