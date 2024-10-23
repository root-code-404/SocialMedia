import React, { useState, useEffect } from 'react';
import "../CSS/signup.css";
import { Form, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    password: '',
    file: null,
    otp: '',
  });

  const [alertType, setAlertType] = useState('success'); // success or danger
  const [showAlert, setShowAlert] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [disableSendOTP, setDisableSendOTP] = useState(false); // State to disable the button
  const [countdown, setCountdown] = useState(60); // Initial countdown value

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: name === 'file' ? files[0] : value
    });
  };

  const handleSendOTP = async () => {
    try {
      const response = await fetch('/api/sendOTP', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      setServerMessage(data.message);

      if (data.success) {
        setAlertType('success');
        setShowAlert(true);
        setDisableSendOTP(true); // Disable the button
        setCountdown(60); // Reset the countdown
        setTimeout(() => {
          setShowAlert(false);
          setServerMessage('');
          setDisableSendOTP(false); // Enable the button after 1 minute
        }, 60000);
        startCountdown(); // Start the countdown timer
      } else {
        setAlertType('danger');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setServerMessage('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('number', formData.number);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('file', formData.file);
      formDataToSend.append('otp', formData.otp);

      const response = await fetch('/api/registration', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      setServerMessage(data.message || 'Error registering user');
      if (data.success) {
        setAlertType('success');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setServerMessage('');
        }, 5000);
        setFormData({
          name: '',
          number: '',
          email: '',
          password: '',
          file: null,
          otp: '',
        });
        setDisableSendOTP(false); // Enable the Send OTP button
        setCountdown(60); // Reset the countdown
      } else {
        setAlertType('danger');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setServerMessage('');
        }, 5000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const startCountdown = () => {
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Clear the interval when the countdown reaches 0
    setTimeout(() => {
      clearInterval(countdownInterval);
    }, 60000);
  };

  useEffect(() => {
    // Reset the countdown and enable the button when the component mounts
    setCountdown(60);
    setDisableSendOTP(false);
  }, []);

  return (
    <div className='mainContainerForsignups'>
      <div className='submainContainers'>
        <div style={{ flex: 1, marginLeft: 150, marginBottom: "170px" }}>
          <p className='logoText'>Soc<span className='part'>ial</span></p>
          <p className='introtexts '>Connect with your <span className='part'>family and friends </span></p>
        </div>
        <div style={{ flex: 3 }}>
          <p className='createaccountTxts'>Create New Account</p>
          <Form onSubmit={handleSubmit}>
            <input type="text" placeholder='Username' className='inputText' name="name" value={formData.name} onChange={handleChange} required />
            <input type="text" placeholder='Phonenumber' className='inputText' name="number" value={formData.number} onChange={handleChange} required />
            <input type="email" placeholder='email' className='inputText' name="email" value={formData.email} onChange={handleChange} required />
            <input type="password" placeholder='******' className='inputText' name="password" value={formData.password} onChange={handleChange} required />
            <input type="file" id="file" className='inputText' name="file" onChange={handleChange} accept="image/*" />
            <input type='text' placeholder='Enter OTP' className='inputText' name='otp' value={formData.otp} onChange={handleChange} required />
            <Button
              type='button'
              className='btnforsignupsss mt-4'
              variant='success'
              onClick={handleSendOTP}
              disabled={disableSendOTP}
            >
              {disableSendOTP ? `Resend OTP in ${countdown}s` : 'Send OTP'}
            </Button>
            <button className='btnforsignups mt-4' type='submit'>
              Signup
            </button>
          </Form>
          {showAlert &&
            <Alert variant={alertType} className='btnforsignupss' onClose={() => setShowAlert(false)} dismissible>
              {serverMessage}
            </Alert>
          }
          <p style={{ textAlign: 'start', marginLeft: "30.6%" }} className='mt-4'>Have an account?
            <Link to="/login" className='ms-1'> Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
