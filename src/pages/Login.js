import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === '1235') {
      localStorage.setItem('isAuthenticated', 'true');
      window.location.href = '/dashboard';
    } else {
      setError('Senha incorreta');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login Dashboard</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a senha"
              className="login-input"
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80vh;
        }
        .login-box {
          background: rgba(19, 20, 30, 0.7);
          padding: 2rem;
          border-radius: 1.25rem;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
        }
        .login-title {
          color: white;
          text-align: center;
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          font-size: 2rem;
          margin-bottom: 2rem;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .login-input {
          width: 100%;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-family: 'Poppins', sans-serif;
        }
        .login-input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }
        .login-button {
          background: #6842ff;
          color: white;
          padding: 0.75rem;
          border: none;
          border-radius: 0.5rem;
          font-family: 'Poppins', sans-serif;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .login-button:hover {
          background: #5636cc;
          transform: translateY(-2px);
        }
        .error-message {
          color: #ff4444;
          text-align: center;
          font-family: 'Poppins', sans-serif;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}

export default Login;