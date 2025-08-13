import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import './App.css';
import logo from './assets/biosync-logo.png';

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [images, setImages] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({ email: '', password: '' });

  // Validar email
  const validateEmail = (email) => {
    if (!email.includes('@') || !email.includes('.')) {
      return 'El correo debe contener "@" y un punto.';
    }
    return '';
  };

  // Validar contraseña
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).+$/;
    if (!regex.test(password)) {
      return 'Debe tener mayúscula, minúscula y un número o símbolo.';
    }
    return '';
  };

  // Login
  const handleLogin = (e) => {
    e.preventDefault();
    const emailError = validateEmail(emailInput);
    const passwordError = validatePassword(passwordInput);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    const hashedEmail = CryptoJS.SHA256(emailInput).toString();
    const hashedPassword = CryptoJS.SHA256(passwordInput).toString();
    const user = users.find(
      (u) => u.emailHash === hashedEmail && u.passwordHash === hashedPassword
    );

    if (user) {
      setLoggedIn(true);
      setEmailInput('');
      setPasswordInput('');
      setErrors({});
    } else {
      alert('Correo o contraseña incorrectos');
    }
  };

  // Registro
  const handleRegister = (e) => {
    e.preventDefault();
    const emailError = validateEmail(emailInput);
    const passwordError = validatePassword(passwordInput);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const hashedEmail = CryptoJS.SHA256(emailInput).toString();
    if (users.some((u) => u.emailHash === hashedEmail)) {
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
    setErrors({});
  };

  // Subir imágenes
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  };

  // Borrar imagen
  const deleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Zoom
  const openZoom = (imgSrc) => setZoomImage(imgSrc);
  const closeZoom = () => setZoomImage(null);

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setEmailInput('');
    setPasswordInput('');
    setConfirmPasswordInput('');
    setErrors({});
  };

  return (
    <div className="container">
      {!loggedIn ? (
        <form
          className="login-form"
          onSubmit={isRegistering ? handleRegister : handleLogin}
        >
          <img src={logo} alt="Logo Biosync" className="logo" />
          <h2>{isRegistering ? "Registro" : "Inicio de Sesión"}</h2>

          <input
            type="email"
            placeholder="Correo electrónico"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}

          <input
            type="password"
            placeholder="Contraseña"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            required
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}

          {isRegistering && (
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPasswordInput}
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
              required
            />
          )}

          <button type="submit">
            {isRegistering ? "Registrarse" : "Ingresar"}
          </button>

          <p className="toggle-text">
            {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
            <button
              type="button"
              className="toggle-button"
              onClick={toggleForm}
            >
              {isRegistering ? " Inicia sesión" : " Regístrate"}
            </button>
          </p>
        </form>
      ) : (
        <div className="dashboard-container">
          <header className="top-bar">
            <div className="top-bar-content">
              <img src={logo} alt="Logo Biosync" className="top-logo" />
              <p className="about-text">
                Al cubrir su rostro con el con el cráneo de su madre, su
                expresión queda velada.La única emoción que le delata es su
                llanto constante. Al cubrir su rostro con el con el cráneo de su
                madre, su expresión queda velada.La única emoción que le delata
                es su llanto constante.
              </p>
            </div>
          </header>

          <div className="dashboard">
            <h2>Bienvenido a Biosync</h2>
            <p>Sube tus historiales médicos(imágenes):</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <div className="image-gallery">
              {images.map((img, i) => (
                <div key={i} className="image-wrapper">
                  <img
                    src={img}
                    alt={`Historial ${i + 1}`}
                    onClick={() => openZoom(img)}
                  />
                  <button
                    className="delete-button"
                    onClick={() => deleteImage(i)}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>

            {zoomImage && (
              <div className="modal" onClick={closeZoom}>
                <span className="close-button" onClick={closeZoom}>
                  &times;
                </span>
                <img
                  className="modal-content"
                  src={zoomImage}
                  alt="Zoomed"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>

          <footer className="bottom-bar">
            <div className="bottom-bar-content">
              <a href="#contacto">Contacto</a>
              <a href="#facebook">Facebook</a>
              <a href="#instagram">Instagram</a>
              <a href="#linkedin">LinkedIn</a>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;