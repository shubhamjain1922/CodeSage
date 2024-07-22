import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../utils/Firebase';
import logo from '../assets/images/RemovebgLogo.png';
import '../css/Signup.css'; // Create this CSS file for signup page
import Button from '../components/button';
import { doc, setDoc } from 'firebase/firestore'; 

const Signup = () => {
  const [name, setName] = useState('');
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
    if (!name.trim()) {
      setError(`Name is required`);
      return;
    }
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        createdAt: new Date(),
      });
      setUser(user);
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
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
        <h1 className="title">Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <Button text='Submit' disabled={!name || !email || !password} loading={isLoading} />
        </form>
        <p className="login-text">
          Already have an account? <Link to="/login" className="login-link">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
