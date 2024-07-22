import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/Firebase';
import logo from '../assets/images/RemovebgLogo.png';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    e.preventDefault();
    setError('');
    if (!email.match(emailRegex)) {
      setError(`Please enter valid email`);
      return;
    }
    if (password?.length < 6) {
      setError(`Password can't be less than 6 letters`);
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid Credentials');
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className='logoContainer'>
      <img src={logo} alt="App Logo" className="logo" />
      </div>
        <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
