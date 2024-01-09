// forgotPasswordController.js
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import mysqlConnection from "../database/db.js"; // Assuming you have a MySQL connection module

export const generateResetToken = async (req, res, next) => {
  const { email } = req.body;
  try {
    const [user] = await mysqlConnection.execute('SELECT * FROM RegisterData WHERE email = ?', [email]);

    if (!user.length) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiration = new Date(Date.now() + 3600000); // Token expiration time: 1 hour

    await mysqlConnection.execute(
      'UPDATE users SET resetToken = ?, resetTokenExpiration = ? WHERE email = ?',
      [resetToken, resetTokenExpiration, email]
    );

    req.resetToken = resetToken;
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const [user] = await mysqlConnection.execute(
      'SELECT * FROM RegisterData WHERE resetToken = ? AND resetTokenExpiration > NOW()',
      [token]
    );

    if (!user.length) {
      return res.status(401).json({ message: 'Invalid or expired reset token.' });
    }

    await mysqlConnection.execute('UPDATE RegisterData SET password = ?, resetToken = NULL, resetTokenExpiration = NULL WHERE id = ?', [password, user[0].id]);

    return res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate reset token and set expiration time (1 hour from now)
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour

    // Update database with reset token and expiration time
    const connection = await mysqlConnection();
    await connection.execute(
      'UPDATE RegisterData SET resetToken = ?, resetTokenExpiration = ? WHERE email = ?',
      [resetToken, resetTokenExpiration, email]
    );

    // Send email with reset token link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "example@gmail.com",
        pass: "email_pasword"
      }
    });

    const mailOptions = {
      from: 'amitsdlv1234@gmail.com',
      to: email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: http://your-app/reset-password/${resetToken}`
    };

    await transporter.sendMail(mailOptions);

    // Send success response
    return res.status(200).json({ message: 'Password reset email sent successfully.' });
  } catch (error) {
    console.error(error);
    // Handle errors and send an error response
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}; 
