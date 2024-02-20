import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import '../css/style.css';
import UserService from "../services/UserService";

const RegistrationForm = () => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const userService = UserService();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [visible, setVisible] = useState(false);
  const [userDetails, setUserDetails] = useState({
    "name": '',
    "email": '',
    "phonenumber": '',
    "username": '',
    "password": '',
    "role": 'B'
  });

  const validateFields = (e) => {
    setErrors({});
    if (e.target.id.indexOf('username') > -1 && !e.target.value) {
      return "Username is mandatory";
    }
    if (e.target.id.indexOf('name') > -1 && !e.target.value) {
      return "Full name is mandatory";
    }
    if (e.target.id.indexOf('email') > -1) {
      if (!e.target.value) {
        return "Email is mandatory";
      }
      if (!emailRegex.test(e.target.value)) {
        return "Enter valid Email";
      }
    }
    if (e.target.id.indexOf('phonenumber') > -1 && !e.target.value) {
      return "mobile number is mandatory";
    }
    if (e.target.id.indexOf('password') > -1) {
      if (!e.target.value) {
        return "Password is mandatory";
      }
      if (!passwordRegex.test(e.target.value)) {
        return "Password must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8-15 characters long.";
      }
    }
  }

  const handleRegister = (e) => {
    e.preventDefault();
    const hasEmptyFields = Object.values(userDetails).some(value => value === '');
    if (hasEmptyFields) {
      alert("All fields are required. Please fill in all the fields.");
      return;
    }
    userService.registerUser(userDetails).then((response) => {
      if (response.status === 200) {
        alert(response.data);
        navigate("/login");
      }

    }).catch((error) => {
      if (error.response.status >= 400) {
        alert(error.response.data);
      }
    })
  }

  const handleInputChange = (event) => {
    const { id, value, type } = event.target;
    const errorMessage = validateFields(event);
    if (errorMessage) {
      setErrors(errorMsg => ({ ...errorMsg, [id]: errorMessage }));
    } else {
      setErrors({ ...errors, [id]: '' });
    }
    if (type === 'radio') {
      setUserDetails((prevUserInfo) => ({
        ...prevUserInfo,
        "role": value === 'Seller' ? 'S' : 'B',
      }));
    } else {
      setUserDetails((prevUserInfo) => ({
        ...prevUserInfo,
        [id]: id === 'phonenumber' ? value.replace(/\D/g, '').slice(0, 10) : value,
      }));
    }
  };

  return (
    <div className="signup template d-flex justify-content-center align-items-center vh-100">
      <div className="form_container p-5 rounded bg-white shadow-lg">
        <form>
          <h3 className="text-center">Sign Up</h3>
          <div className="mb-2">
            <label htmlFor="fullname">FullName</label>
            <input type="text" id="name" placeholder="Enter Fullname" className="form-control" onChange={handleInputChange} value={userDetails.name} autoComplete="off" onBlur={handleInputChange} />
            <div className="text-danger" style={{ fontSize: '12px' }}>{errors.name}</div>
          </div>
          <div className="mb-2">
            <label htmlFor="email">Email</label>
            <input type="text" id="email" placeholder="Enter Email" className="form-control" onChange={handleInputChange} value={userDetails.email} autoComplete="off" onBlur={handleInputChange} />
            <div className="text-danger" style={{ fontSize: '12px' }}>{errors.email}</div>
          </div>
          <div className="mb-2">
            <label htmlFor="phonenumber">Mobile Number</label>
            <input type="text" id="phonenumber" placeholder="Enter Phone Number" className="form-control" onChange={handleInputChange} maxLength={10} value={userDetails.phonenumber} autoComplete="off" onBlur={handleInputChange} />
            <div className="text-danger" style={{ fontSize: '12px' }}>{errors.phonenumber}</div>
          </div>
          <div className="mb-2">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter Username" className="form-control" onChange={handleInputChange} value={userDetails.username} autoComplete="off" onBlur={handleInputChange} />
            <div className="text-danger" style={{ fontSize: '12px' }}>{errors.username}</div>
          </div>
          <div className="mb-2">
            <label htmlFor="password" >Password</label>
            <div className="password-input-container">
              <input type={visible ? "text" : "password"} id="password" placeholder="Enter password" className="form-control" onChange={handleInputChange} value={userDetails.password} onBlur={handleInputChange} />
              <span className="password-toggle" onClick={() => setVisible(!visible)}> {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}</span>
            </div>
            <div className="text-danger" style={{ fontSize: '12px' }}>{errors.password}</div>
          </div>
          <input type="radio" name="userType" value="Buyer" id="buyer" className='me-2' onChange={handleInputChange} defaultChecked />
          <label htmlFor="buyer" className='me-5'>Buyer</label>
          <input type="radio" name="userType" value="Seller" id="seller" className='me-2' onChange={handleInputChange} />
          <label htmlFor="seller" className='me-5'>Seller</label>
          <button type="submit" className="btn btn-primary" onClick={handleRegister}>Sign Up</button>
          <p className="text-right">Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
    </div>
  )
}

export default RegistrationForm;