import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import './App.css';
import logo from './assets/biosync-logo.png';

function App() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [identifierInput, setIdentifierInput] = useState(''); // email o teléfono
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [images, setImages] = useState([]);
  const [zoomImage, setZoomImage] = useState(null);
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({
    identifier: '',
    password: '',
    confirmPassword: '',
    file: ''
  });

  // Validar email
  const validateEmail = (email) => {
    if (!email.includes('@') || !email.includes('.')) {
      return 'El correo debe contener "@" y un "."';
    }
    return '';
  };

  // Validar teléfono
  const validatePhone = (phone) => {
    if (!phone.startsWith('+569') || phone.length !== 12) {
      return 'El teléfono debe comenzar con +569 y tener 12 caracteres.';
    }
    return '';
  };

  // Validar identificador (correo o teléfono)
  const validateIdentifier = (value) => {
    if (value.startsWith('+')) {
      return validatePhone(value);
    }
    return validateEmail(value);
  };

  // Validar contraseña
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/;
    if (!regex.test(password)) {
      return 'Debe tener mínimo 8 caracteres, mayúscula, minúscula y un número o símbolo.';
    }
    return '';
  };

  // Validar confirmación de contraseña
  const validateConfirmPassword = (pass, confirmPass) => {
    if (pass !== confirmPass) {
      return 'Las contraseñas no coinciden.';
    }
    return '';
  };

  // Login
  const handleLogin = (e) => {
    e.preventDefault();
    const identifierError = validateIdentifier(identifierInput);
    const passwordError = validatePassword(passwordInput);

    if (identifierError || passwordError) {
      setErrors({ ...errors, identifier: identifierError, password: passwordError });
      return;
    }

    const hashedIdentifier = CryptoJS.SHA256(identifierInput).toString();
    const hashedPassword = CryptoJS.SHA256(passwordInput).toString();
    const user = users.find(
      (u) => u.identifierHash === hashedIdentifier && u.passwordHash === hashedPassword
    );

    if (user) {
      setLoggedIn(true);
      setIdentifierInput('');
      setPasswordInput('');
      setErrors({});
    } else {
      alert('Correo/Teléfono o contraseña incorrectos');
    }
  };

  // Registro
  const handleRegister = (e) => {
    e.preventDefault();
    const identifierError = validateIdentifier(identifierInput);
    const passwordError = validatePassword(passwordInput);
    const confirmPasswordError = validateConfirmPassword(passwordInput, confirmPasswordInput);

    if (identifierError || passwordError || confirmPasswordError) {
      setErrors({
        ...errors,
        identifier: identifierError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      });
      return;
    }

    const hashedIdentifier = CryptoJS.SHA256(identifierInput).toString();
    if (users.some((u) => u.identifierHash === hashedIdentifier)) {
      alert('Usuario ya registrado');
      return;
    }

    const hashedPassword = CryptoJS.SHA256(passwordInput).toString();
    setUsers([...users, { identifierHash: hashedIdentifier, passwordHash: hashedPassword }]);
    alert('Registro exitoso. Ahora inicia sesión.');
    setIsRegistering(false);
    setIdentifierInput('');
    setPasswordInput('');
    setConfirmPasswordInput('');
    setErrors({});
  };

  // Subir imágenes con límite de 2 MB
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    let validFiles = [];
    let errorMsg = '';

    files.forEach((file) => {
      if (file.size > 2 * 1024 * 1024) {
        errorMsg = `El archivo "${file.name}" supera los 2 MB.`;
      } else {
        validFiles.push(URL.createObjectURL(file));
      }
    });

    if (errorMsg) {
      setErrors((prev) => ({ ...prev, file: errorMsg }));
    } else {
      setErrors((prev) => ({ ...prev, file: '' }));
      setImages((prev) => [...prev, ...validFiles]);
    }
  };

  // Borrar imagen con confirmación
  const deleteImage = (index) => {
    const confirmDelete = window.confirm('¿Seguro que quieres eliminar esta imagen?');
    if (confirmDelete) {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Zoom
  const openZoom = (imgSrc) => setZoomImage(imgSrc);
  const closeZoom = () => setZoomImage(null);

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
    setIdentifierInput('');
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
            type="text"
            placeholder="Correo electrónico o teléfono (+569...)"
            value={identifierInput}
            onChange={(e) => {
              setIdentifierInput(e.target.value);
              setErrors({ ...errors, identifier: validateIdentifier(e.target.value) });
            }}
            required
          />
          {errors.identifier && <p className="error-message">{errors.identifier}</p>}

          <input
            type="password"
            placeholder="Contraseña"
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
              setErrors({ ...errors, password: validatePassword(e.target.value) });
            }}
            required
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}

          {isRegistering && (
            <>
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPasswordInput}
                onChange={(e) => {
                  setConfirmPasswordInput(e.target.value);
                  setErrors({
                    ...errors,
                    confirmPassword: validateConfirmPassword(passwordInput, e.target.value),
                  });
                }}
                required
              />
              {errors.confirmPassword && (
                <p className="error-message">{errors.confirmPassword}</p>
              )}
            </>
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
                Al cubrir su rostro con el cráneo de su madre, su
                expresión queda velada. La única emoción que le delata es su
                llanto constante.
              </p>
            </div>
          </header>

          <div className="dashboard">
            <h2>Bienvenido a Biosync</h2>
            <p>Sube tus historiales médicos (imágenes):</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            {errors.file && <p className="error-message">{errors.file}</p>}

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
