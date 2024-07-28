import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/RemovebgLogo.png'; // Adjust path as needed
import { signOut } from 'firebase/auth';
import { auth } from '../utils/Firebase';
import styles from '../css/Navbar.module.css'; // Update import to CSS module

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <img onClick={handleLogoClick} src={logo} alt="App Logo" className={styles.navbarLogo} />
      </div>
      <div className={styles.navbarRight}>
        <div className={styles.profileSection}>
          {user && (
            <>
              <div className={styles.profileIcon}>👤</div>
              <span className={styles.profileName}>{user.name || user.email}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
