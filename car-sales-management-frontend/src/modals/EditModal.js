import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import VehicleService from '../services/VehicleService';
import Lightbox from 'react-image-lightbox';

const EditModal = (props) => {
  const port = "http://localhost:8080";
  const carDetails = props.carDetailInfo;
  const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};
  const vehicleService = VehicleService();
  const lightboxImage = port + carDetails.image;
  const [imageFile, setImageFile] = useState(undefined);
  const [imageLightboxOpen, setImageLightboxOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const [carInfo, setCarInfo] = useState({
    "carName": carDetails.carName,
    "carModel": carDetails.carModel,
    "registrationNumber": carDetails.registrationNumber,
    "yearOfManufacture": carDetails.yearOfManufacture,
    "carPrice": carDetails.carPrice,
    "milesTravelled": carDetails.milesTravelled,
    "image": carDetails.image
  });

  const validateFields = (e) => {
    setErrors({});
    if (e.target.id.indexOf('carName') > -1 && !e.target.value) {
      return "Car name is mandatory";
    }
    if (e.target.id.indexOf('carModel') > -1 && !e.target.value) {
      return "Car model is mandatory";
    }
    if (e.target.id.indexOf('registrationNumber') > -1 && !e.target.value) {
      return "Registration number is mandatory";
    }
    if (e.target.id.indexOf('yearOfManufacture') > -1) {
      if (!e.target.value) {
        return "year of manufacture is mandatory";
      }
    }
    if (e.target.id.indexOf('carPrice') > -1) {
      if (!e.target.value) {
        return "Car price is mandatory";
      }
      if (e.target.value > 80000) {
        return "Car price cannot exceed $80000";
      }
    }
    if (e.target.id.indexOf('milesTravelled') > -1 && !e.target.value) {
      return "Miles is mandatory";
    }

  }

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    const errorMessage = validateFields(event);
    if (errorMessage) {
      setErrors(errorMsg => ({ ...errorMsg, [id]: errorMessage }));
    } else {
      setErrors({ ...errors, [id]: '' });
    }
    setCarInfo((prevCarInfo) => ({
      ...prevCarInfo,
      [id]: value,
    }));
  }

  const handleEdit = (e) => {
    e.preventDefault();
    const hasEmptyFields = Object.values(carInfo).some(value => value === '');
    if (hasEmptyFields) {
      alert("All fields are required. Please fill in all the fields.");
      return;
    }
    const formData = new FormData();
    formData.append('vehicle', JSON.stringify(carInfo));
    formData.append('image', imageFile);
    vehicleService.updateCarById(formData, carDetails.id, userDetails.id).then((response) => {
      if (response.status === 200) {
        alert(response.data);
        window.location.reload();
      }
    }).catch((error) => {
      if (!error.response && error.message != null) {
        alert(error.message);
      } else if (error.response.status >= 400) {
        alert(error.response.data);
      }
    });
    props.onHide();
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setImageFile(selectedFile);
  }

  const handleImageClick = () => {
    setImageLightboxOpen(true);
  }

  const handleLightboxClose = () => {
    setImageLightboxOpen(false);
  }

  return (
    <>
      {!imageLightboxOpen && <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Car Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='row'>
            <div className='col-4'>
              <img src={port + carInfo.image} alt="Car Img" height="90px" className='rounded-3 profile' onClick={() => { handleImageClick(carInfo.image) }} />
              <div class="form-floating mb-3">
                <input type="file" accept="image/*" onChange={handleFileChange} />
              </div>
            </div>
            <div className='col'>
              <div className='g-0 row gap-2'>
                <div class="form-floating col-3 ">
                  <input aria-label="input" type="text" id="carName" class="form-control" placeholder='Car Name' value={carInfo.carName} onChange={handleInputChange} onBlur={handleInputChange} autoComplete='off' />
                  <label for="carName">Car Name</label>
                  {errors.carName && <div className="text-danger" style={{ fontSize: '12px' }}>{errors.carName}</div>}
                </div>
                <div class="form-floating col-4">
                  <input aria-label="input" type="text" id="carModel" class="form-control" placeholder='Car Model' value={carInfo.carModel} onChange={handleInputChange} onBlur={handleInputChange} autoComplete='off' />
                  <label for="carModel">Car Model</label>
                  {errors.carModel && <div className="text-danger" style={{ fontSize: '12px' }}>{errors.carModel}</div>}
                </div>
                <div class="form-floating col-4">
                  <input aria-label="text" type="text" id="registrationNumber" class="form-control" placeholder='Registration Number' value={carInfo.registrationNumber} onChange={handleInputChange} onBlur={handleInputChange} autoComplete='off' />
                  <label for="registrationNumber">Registration Number</label>
                  {errors.registrationNumber && <div className="text-danger" style={{ fontSize: '12px' }}>{errors.registrationNumber}</div>}
                </div>
                <div class="form-floating col-3">
                  <input aria-label="text input" type="text" id="carPrice" placeholder='Car Price' class="form-control" value={carInfo.carPrice} onChange={handleInputChange} onBlur={handleInputChange} autoComplete='off' />
                  <label for="carPrice">Car Price</label>
                  {errors.carPrice && <div className="text-danger">{errors.carPrice}</div>}
                </div>
                <div class="form-floating col-4">
                  <input aria-label="text input" type="number" id="milesTravelled" placeholder='Miles Covered' class="form-control" value={carInfo.milesTravelled} onChange={handleInputChange} onBlur={handleInputChange} autoComplete='off' />
                  <label for="milesTravelled">Miles Covered</label>
                  {errors.milesTravelled && <div className="text-danger" style={{ fontSize: '12px' }}>{errors.milesTravelled}</div>}
                </div>
                <div class="form-floating col-4">
                  <input aria-label="text input" type="text" id="yearOfManufacture" placeholder='Year Of Manufacture' class="form-control" value={carInfo.yearOfManufacture} onChange={handleInputChange} onBlur={handleInputChange} autoComplete='off' />
                  <label for="yearOfManufacture">Year Of Manufacture</label>
                  {errors.yearOfManufacture && <div className="text-danger">{errors.yearOfManufacture}</div>}
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleEdit}>Update</Button>
        </Modal.Footer>
      </Modal>}
      {imageLightboxOpen && <Lightbox mainSrc={lightboxImage} onCloseRequest={handleLightboxClose} />}
    </>
  )
}

export default EditModal