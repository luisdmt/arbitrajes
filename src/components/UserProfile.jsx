import React, { useState, useRef, useEffect } from 'react';
    import { FaPlus } from 'react-icons/fa';
    import * as localforage from 'localforage';

    function UserProfile({ user, onClose }) {
      const [name, setName] = useState(user.username);
      const [email, setEmail] = useState('');
      const [phone, setPhone] = useState('');
      const [profilePic, setProfilePic] = useState('https://placekitten.com/100/100');
      const [activityHistory, setActivityHistory] = useState([
        { timestamp: '16/1/2025, 16:54:20', type: 'Cálculo', details: 'Venta: 54.4, Compra: 53.7, Cantidad: 100000 VES, Ganancia: 1287.47 VES' },
        { timestamp: '15/1/2025, 10:22:15', type: 'Cálculo', details: 'Venta: 55.0, Compra: 54.5, Cantidad: 50000 VES, Ganancia: 458.23 VES' },
      ]);
      const fileInputRef = useRef(null);

      useEffect(() => {
        loadProfile();
      }, []);

      const loadProfile = async () => {
        const storedProfile = await localforage.getItem('userProfile') || {};
        setName(storedProfile.name || user.username);
        setEmail(storedProfile.email || 'user@example.com');
        setPhone(storedProfile.phone || '123-456-7890');
        setProfilePic(storedProfile.profilePic || 'https://placekitten.com/100/100');
      };

      const handleProfilePicClick = () => {
        fileInputRef.current.click();
      };

      const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfilePic(reader.result);
          };
          reader.readAsDataURL(file);
        }
      };

      const handleSave = async () => {
        const profileData = {
          name,
          email,
          phone,
          profilePic,
        };
        await localforage.setItem('userProfile', profileData);
        alert('Changes saved!');
        onClose();
      };

      return (
        <div className="modal-content">
          <h2>Perfil de Usuario</h2>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div className="profile-pic-container" onClick={handleProfilePicClick}>
              <img
                src={profilePic}
                alt="Foto de perfil"
                style={{ borderRadius: '50%', width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <FaPlus className="plus-icon" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <h3>{name}</h3>
          </div>
          <div className="form-group">
            <label>Nombre Completo:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Número de Teléfono:</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="history-container">
            <h4>Historial de Actividad</h4>
            {activityHistory.map((item, index) => (
              <div key={index} className="history-item">
                <span>
                  {item.timestamp}: {item.type} - {item.details}
                </span>
              </div>
            ))}
          </div>
          <button onClick={handleSave}>Guardar Cambios</button>
          <button onClick={onClose}>Cerrar Perfil</button>
        </div>
      );
    }

    export default UserProfile;
