import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/Firebase';
import logo from '../assets/images/RemovebgLogo.png';
import styles from '../css/Login.module.css';
import Button from '../components/button';
import { useModal } from '../context/ModalContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {setIsSignupOpen, setIsLoginOpen} = useModal();

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
      await signInWithEmailAndPassword(auth, email, password);
      setIsLoginOpen(false);
    } catch (error) {
      setIsLoading(false);
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid Credentials');
      } else {
        setError(error.message);
      }
    }
  };

  const handleSignup = () => {
    setIsSignupOpen(true)
    setIsLoginOpen(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logoContainer}>
          <img src={logo} alt="App Logo" className={styles.logo} />
        </div>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.buttonContainer}>
            <Button text='Submit' disabled={!email || !password } loading={isLoading} />
          </div>
        </form>
        <p className={styles.signupText}>
          Don't have an account? <span onClick={handleSignup} className={styles.signupLink}>Sign up</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
