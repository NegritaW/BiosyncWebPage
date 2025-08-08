import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import './App.css';
import logo from './assets/biosync-logo.png'; // Asegúrate de tener tu logo aquí

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [images, setImages] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);

  // Usuarios guardados en estado (solo para demo, en producción backend)
  const [users, setUsers] = useState([]);

  // Manejar login
  const handleLogin = (e) => {
    e.preventDefault();
    const hashedEmail = CryptoJS.SHA256(emailInput).toString();
    const hashedPassword = CryptoJS.SHA256(passwordInput).toString();

    const user = users.find(
      (u) => u.emailHash === hashedEmail && u.passwordHash === hashedPassword
    );

    if (user) {
      setLoggedIn(true);
      setEmailInput('');
      setPasswordInput('');
    } else {
      alert('Correo o contraseña incorrectos');
    }
  };

  // Manejar registro
  const handleRegister = (e) => {
    e.preventDefault();

    if (passwordInput !== confirmPasswordInput) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const hashedEmail = CryptoJS.SHA256(emailInput).toString();
    const userExists = users.some((u) => u.emailHash === hashedEmail);

    if (userExists) {
      alert('Usuario ya registrado');
      return;
    }

    const hashedPassword = CryptoJS.SHA256(passwordInput).toString();
    setUsers([...users, { emailHash: hashedEmail, passwordHash: hashedPassword }]);
    alert('Registro exitoso. Ahora inicia sesión.');
    setIsRegistering(false);
    setEmailInput('');
    setPasswordInput('');
    setConfirmPasswordInput('');
  };

  // Subida de imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  };

  // Abrir modal zoom
  const openZoom = (imgSrc) => {
    setZoomImage(imgSrc);
  };

  // Cerrar modal zoom
  const closeZoom = () => {
    setZoomImage(null);
  };

  // Cambiar entre login y registro
  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setEmailInput('');
    setPasswordInput('');
    setConfirmPasswordInput('');
  };

  return (
    <div className="container">
      {!loggedIn ? (
        <form
          className="login-form"
          onSubmit={isRegistering ? handleRegister : handleLogin}
        >
          <img src={logo} alt="Logo Biosync" className="logo" />
          <h2>{isRegistering ? 'Registro' : 'Inicio de Sesión'}</h2>

          <input
            type="email"
            placeholder="Correo electrónico"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
          />
          {isRegistering && (
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPasswordInput}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
              required
            />
          )}

          <button type="submit">{isRegistering ? 'Registrarse' : 'Ingresar'}</button>

          <p className="toggle-text">
            {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
            <button
              type="button"
              className="toggle-button"
              onClick={toggleForm}
            >
              {isRegistering ? ' Inicia sesión' : ' Regístrate'}
            </button>
          </p>
        </form>
      ) : (
        <div className="dashboard">
          <h2>Bienvenido a Biosync</h2>
          <p>Sube tus historiales médicos (imágenes):</p>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
          />
          <div className="image-gallery">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Historial ${i + 1}`}
                onClick={() => openZoom(img)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>

          {zoomImage && (
            <div className="modal" onClick={closeZoom}>
              <span className="close-button" onClick={closeZoom}>&times;</span>
              <img
                className="modal-content"
                src={zoomImage}
                alt="Zoomed"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;