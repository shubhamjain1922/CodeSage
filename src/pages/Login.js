import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/Firebase';
import logo from '../assets/images/RemovebgLogo.png';
import '../css/Login.css';
import Button from '../components/button';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    e.preventDefault();
    setError('');
    if (!email.match(emailRegex)) {
      setError(`Please enter a valid email`);
      return;
    }
    if (password?.length < 6) {
      setError(`Password can't be less than 6 letters`);
      return;
    }
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
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
          <Button text='Submit' disabled={!email || !password } loading={isLoading} />
        </form>
        <p className="signup-text">
          Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
