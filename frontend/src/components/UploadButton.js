// Button.js
import React from 'react';
import '../css/uploadbutton.css';
import iconSettings from './assets/settings.svg';

export const UploadButton = ({ isLoading, handleClick }) => {
  return (
    // In your Button component
        <button
        onClick={handleClick}
        className={`upload-button ${isLoading ? "loading" : ""}`}
        >
        <img src={iconSettings} alt="Settings" />
        <span>{isLoading ? "Uploading" : "Upload Moment"}</span>
        </button>
  );
};
