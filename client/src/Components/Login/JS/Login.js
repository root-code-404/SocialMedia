import React, { useState, useEffect } from 'react';
import '../CSS/login.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Alert, Modal, Button, Form } from 'react-bootstrap';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    verificationCode: '',
    newPassword: '',
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [disableSendOTP, setDisableSendOTP] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleForgotPasswordInputChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData({ ...forgotPasswordData, [name]: value });
  };

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    // Clear message when closing the modal
    setAlertMessage('');
    // Clear the forgotPasswordData state to reset the fields
    setForgotPasswordData({
      email: '',
      verificationCode: '',
      newPassword: '',
    });
    // Reset the countdown
    setCountdown(0);
    setDisableSendOTP(false);
  };

  const handleShowForgotPasswordModal = () => {
    setShowForgotPasswordModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const { usertype } = data;

        switch (usertype) {
          case 1:
            navigate('/userdetails');
            break;
          case 2:
            navigate('/home');
            break;
          case 3:
            navigate('/company');
            break;
          default:
            console.error('Invalid usertype');
            setShowErrorAlert(true);
            setTimeout(() => setShowErrorAlert(false), 3000);
        }
      } else {
        console.error('Error logging in.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSendOTP = async () => {
    try {
      const response = await fetch('/api/otpSend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordData.email }),
      });

      const data = await response.json();

      if (data.success) {
        // Handle success, e.g., show a success message to the user
        setAlertMessage(data.message);
        // Disable the button and start the countdown
        setDisableSendOTP(true);
        setCountdown(60);
        const countdownInterval = setInterval(() => {
          setCountdown((prevCount) => prevCount - 1);
        }, 1000);

        // Enable the button after 1 minute
        setTimeout(() => {
          clearInterval(countdownInterval);
          setCountdown(0);
          setDisableSendOTP(false);
        }, 60000);
      } else {
        // Handle error, e.g., show an error message to the user
        setAlertMessage(data.message);
        console.error('Error sending password reset link.');
      }
    } catch (error) {
      console.error('Error:', error);

    }
  };


  const handleResetPassword = async () => {
    try {

      // Check if any of the fields are empty
      if (!forgotPasswordData.email || !forgotPasswordData.verificationCode || !forgotPasswordData.newPassword) {
        setAlertMessage('Please enter all fields.');
        return;
      }

      const response = await fetch('/api/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(forgotPasswordData),
      });

      const data = await response.json();
      console.log(data)

      if (response.ok) {
        // Handle success, e.g., show a success message to the user
        setAlertMessage(data.message);
        // Clear the forgotPasswordData state to reset the fields
        setForgotPasswordData({
          email: '',
          verificationCode: '',
          newPassword: '',
        });
        // Reset the countdown and enable the "Send OTP" button
        setCountdown(0);
        setDisableSendOTP(false);
      } else {
        // Handle error, e.g., show an error message to the user
        setAlertMessage(data.message);
        console.error('Error resetting password.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Reset the countdown and enable the button when the component mounts
    setCountdown(60);
    setDisableSendOTP(false);
  }, []);

  return (
    <div className='mainContainerForsignup'>
      <div className='submainContainer'>
        <div style={{ flex: 1, marginLeft: 150, marginBottom: "170px" }}>
          <p className='logoText'>Soc<span className='part'>ial</span></p>
          <p className='introtext'>Connect with your <span className='part'>family and friends </span></p>
        </div>
        <div style={{ flex: 3 }}>
          <p className='createaccountTxt'>Login Account</p>
          <form onSubmit={handleSubmit}>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} id="email" placeholder='Email' className='inputText' required />
            <input type="password" placeholder='******' name="password" value={formData.password} onChange={handleInputChange} id="password" className='inputText' required />
            <button className='btnforsignup mt-4 mb-4' type='submit'>Login</button>
          </form>

          {showErrorAlert &&
            <Alert variant="danger" className='btnforsignup' onClose={() => setShowErrorAlert(false)} dismissible>
              Error logging in.
            </Alert>
          }

          <p style={{ textAlign: 'start', marginLeft: "30.6%" }}>Don't have an account?
            <Link to="/" className='ms-1'> Sign up</Link></p>
          <p style={{ textAlign: 'start', marginLeft: "30.6%", cursor: 'pointer', color: 'red', textDecoration: 'underline' }} onClick={handleShowForgotPasswordModal}>
            Forgotten your password?
          </p>
        </div>
      </div>
      <Modal show={showForgotPasswordModal} onHide={handleCloseForgotPasswordModal}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={forgotPasswordData.email}
                onChange={handleForgotPasswordInputChange}

              />
            </Form.Group>

            <Form.Group controlId="formOTP" className="mb-3 mt-2">
              <Form.Label>Enter OTP</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  placeholder="Enter OTP"
                  name="verificationCode"
                  value={forgotPasswordData.verificationCode}
                  onChange={handleForgotPasswordInputChange}
                />
                <Button variant="success" className="ms-2" onClick={handleSendOTP} disabled={disableSendOTP}>
                  {disableSendOTP ? `Resend OTP in ${countdown}s` : 'Send OTP'}
                </Button>
              </div>
            </Form.Group>

            <Form.Group controlId="formPassword">
              <Form.Label>Enter New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your new password"
                name="newPassword"
                value={forgotPasswordData.newPassword}
                onChange={handleForgotPasswordInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="danger" onClick={handleCloseForgotPasswordModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleResetPassword}>
            Reset Password
          </Button>
        </Modal.Footer>

        {alertMessage &&   // Display message alert
          <Alert
            variant={alertMessage.includes('success') ? 'success' : 'danger'}
            onClose={() => setAlertMessage('')}
            dismissible
          >
            {alertMessage}
          </Alert>
        }
      </Modal>
    </div>
  );
}
