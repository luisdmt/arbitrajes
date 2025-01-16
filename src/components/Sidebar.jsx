import React from 'react';
    import { useNavigate } from 'react-router-dom';

    function Sidebar({ isOpen, onClose, user, onLogout, onViewUser }) {
      const navigate = useNavigate();

      const handleLogout = () => {
        onLogout();
        onClose();
      };

      return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
          <ul>
            {user && (
              <>
                <li>
                  <button onClick={onViewUser}>Ver Usuario</button>
                </li>
                <li>
                  <button onClick={handleLogout}>Cerrar Sesión</button>
                </li>
              </>
            )}
          </ul>
        </div>
      );
    }

    export default Sidebar;
