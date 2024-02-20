import React, { useState } from "react";
import '../css/style.css';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import UserService from "../services/UserService";

const LoginForm = () => {

  const userService = UserService();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [userDetails, setUserDetails] = useState({
    "username": '',
    "password": '',
    "role": 'A'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    } else {
      setErrors({});
    }
    userService.loginUser(userDetails).then((response) => {
      if (response.status === 200) {
        localStorage.setItem("userDetails", JSON.stringify(response.data));
        navigate("/dashboard");
      }
    }).catch((error) => {
      if (!error.response && error.message != null) {
        alert(error.message);
      } else if (error.response.status >= 400) {
        alert(error.response.data);
      }
    })
  }

  const validate = () => {
    let validationErrors = {};
    if (!userDetails.username) {
      validationErrors.username = 'Username is required';
    }
    if (!userDetails.password) {
      validationErrors.password = 'Password is required';
    } else if (userDetails.password.length < 8 || userDetails.password.length > 15) {
      validationErrors.password = 'Password must be at least 8 - 15 characters ';
    }
    return validationErrors;
  }

  const handleInputChange = (event) => {
    setErrors({});
    const { id, value, type } = event.target;
    if (type === 'radio') {
      setUserDetails((prevUserInfo) => ({
        ...prevUserInfo,
        "role": getRole(value),
      }));
    } else {
      setUserDetails((prevUserInfo) => ({
        ...prevUserInfo,
        [id]: value,
      }));
    }
  };

  const getRole = (value) => {
    switch (value) {
      case "Seller": return 'S';
      case "Buyer": return 'B';
      case "Admin": return 'A';
      default: return null;
    }
  }

  return (
    <div className="login template d-flex justify-content-center align-items-center vh-100">
      <div className="form_container p-5 rounded shadow-lg">
        <form>
          <h3 className="text-center">Sign In</h3>
          <div className="mb-2">
            <label htmlFor="username">Username</label>
            <input type="text" id="username" placeholder="Enter Username" className="form-control" onChange={handleInputChange} autoComplete="off" />
            {errors.username && <div className="text-danger">{errors.username}</div>}
          </div>
          <div className="mb-2">
            <label htmlFor="password" >Password</label>
            <div className="password-input-container">
              <input type={visible ? "text" : "password"} id="password" placeholder="Enter password" className="form-control" onChange={handleInputChange} />
              <span className="password-toggle" onClick={() => setVisible(!visible)}> {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}</span>
            </div>
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>
          <div>
            <input type="radio" name="userType" value="Admin" id="admin" className='me-1' onChange={handleInputChange} defaultChecked />
            <label htmlFor="admin" className='me-4'>Admin</label>
            <input type="radio" name="userType" value="Seller" id="seller" className='me-1' onChange={handleInputChange} />
            <label htmlFor="seller" className='me-4'>Seller</label>
            <input type="radio" name="userType" value="Buyer" id="buyer" className='me-1' onChange={handleInputChange} />
            <label htmlFor="buyer" className='me-4'>Buyer</label>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Sign In</button>
          </div>
          <p className="text-right mt-2">Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </form>
      </div>
    </div>
  )

}

export default LoginForm;