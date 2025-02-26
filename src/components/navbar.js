import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/images/RemovebgLogo.png"; // Adjust path as needed
import { signOut } from "firebase/auth";
import { auth } from "../utils/Firebase";
import styles from "../css/Navbar.module.css"; // Update import to CSS module
import { useModal } from "../context/ModalContext";
import Modal from "./modal";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const { setIsLoginOpen, isLoginOpen, isSignupOpen, setIsSignupOpen } =
    useModal();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLogoClick = () => {
    navigate("/home");
  };

  const handleLogin = () => {
    setIsLoginOpen(true);
  };

  return (
    <nav className={styles.navbar}>
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <Login />
      </Modal>

      <Modal isOpen={isSignupOpen} onClose={() => setIsSignupOpen(false)}>
        <Signup />
      </Modal>
      <div className={styles.navbarLeft}>
        <img
          onClick={handleLogoClick}
          src={logo}
          alt="App Logo"
          className={styles.navbarLogo}
        />
      </div>
      <div className={styles.navbarRight}>
        <div className={styles.profileSection}>
          {user ? (
            <>
              <div className={styles.profileIcon}>👤</div>
              <span className={styles.profileName}>
                {user.name || user.email}
              </span>
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={handleLogin} className={styles.logoutButton}>
                👤 Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
