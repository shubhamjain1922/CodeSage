import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    return;
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ isLoginOpen, setIsLoginOpen, isSignupOpen, setIsSignupOpen}}>
      {children}
    </ModalContext.Provider>
  );
};
