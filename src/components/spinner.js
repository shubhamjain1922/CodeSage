// Spinner.js
import React from 'react';
import styles from '../css/Spinner.module.css'; // Import spinner CSS

const Spinner = ({className}) => (
  <div className={[styles.spinner, className].join(" ")}></div>
);

export default Spinner;
