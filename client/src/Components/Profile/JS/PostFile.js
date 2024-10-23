import React, { useState } from 'react';
import "../CSS/postfile.css";
import Navbar from '../../Login/JS/Navbar';
import { Form, Alert } from 'react-bootstrap';

export default function PostFile() {

  const [formData, setFormData] = useState({
    caption: '',
    file: null,
  });

  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false); // State for error alert


  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData({
      ...formData,
      [name]: name === 'file' ? files[0] : value
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const formDataToSend = new FormData();
      formDataToSend.append('caption', formData.caption);
      formDataToSend.append('file', formData.file);

      const response = await fetch('/api/post', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();
      console.log(data)

      if (data.success) {
        setShowAlert(true); // Show the alert on successful postUpload
        setTimeout(() => setShowAlert(false), 3000); // Hide the alert after 3 seconds
        setFormData({
          caption: '',
          file: null,
        });
      } else {
        setShowErrorAlert(true); // Show error alert on failed postupload
        setTimeout(() => setShowErrorAlert(false), 3000); // Hide error alert after 3 seconds
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className='mainContainerForsignupq'>
      <Navbar />
      <div className='submainContainer'>
        <div style={{ flex: 1, marginLeft: 150, marginBottom: "170px" }}>
          <p className='logoText'>Soc<span className='part'>ial</span></p>
          <p className='introtext'>Connect with your <span className='part'>family and friends </span></p>
        </div>
        <div style={{ flex: 3 }}>
          <p className='createaccountTxt'>Create Your Post</p>
          <Form onSubmit={handleSubmit}>
            <input text="textarea" placeholder='enter your caption' className='inputTexts' name="caption" value={formData.caption} onChange={handleChange} />
            <input type="file" name="file" id="file" className='inputText' onChange={handleChange} accept="image/*" required />

            <button className='btnforsignup mt-4' type='submit'>Post</button>
          </Form>
          {showAlert &&
            <Alert variant="success" className='btnforsignupss' onClose={() => setShowAlert(false)} dismissible>
              Post Uploaded!
            </Alert>
          }
          {showErrorAlert &&
            <Alert variant="danger" className='btnforsignupss' onClose={() => setShowErrorAlert(false)} dismissible>
              Error uploading post
            </Alert>
          }

        </div>
      </div>
    </div>
  )
}
