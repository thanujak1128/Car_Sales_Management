import React, { useState } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import VehicleService from '../services/VehicleService';

const ApproveModal = ({ carId, ...props }) => {
    const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};
    const vehicleService = VehicleService();

    const [percentage, setPercentage] = useState('');

    const handleInputChange = (e) => {
        setPercentage(e.target.value);
    }

    const handleApprove = () => {
            vehicleService.approveVehicle(carId, userDetails.id, percentage, userDetails.role).then((response) => {
                if (response.status === 200) {
                    alert(response.data);
                    props.onHide();
                    window.location.reload();
                }
            }).catch((error) => {
                if(!error.response) {
                    alert("Something went wrong");
                }else if (error.response.status >= 400) {
                    alert(error.response.data);
                }
            });
    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Approve Car
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='g-0 row gap-2'>
                    <div class="form-floating col-3 ">
                        <input aria-label="input" type="text" id="commission" class="form-control" placeholder='Commission Percentage' value={percentage} onChange={handleInputChange} /><label for="commission">commission percentage</label>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant=' ' className='btn-success' onClick={handleApprove}>Approve</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ApproveModal