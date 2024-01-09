import React, { useState } from 'react';
import {resetPassword}  from '../service/api'; // Implement this API function to send reset password email

const ResetPassword = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Call the API to send a reset password email
    try {
      await resetPassword(email);
      alert('Reset password link sent to your email.');
    } catch (error) {
      console.error('Error sending reset password email:', error);
      alert('Error sending reset password email. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
