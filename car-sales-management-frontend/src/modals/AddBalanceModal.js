import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import UserService from "../services/UserService";

const AddBalanceModal = (props) => {

    const [amount, setAmount] = useState();
    const [error, setError] = useState(null);
    const userService = UserService();
    const userDetails = localStorage.getItem("userDetails") != null ? JSON.parse(localStorage.getItem("userDetails")) : {};
    const [disable, setDisable] = useState(false);


    const handleChange = (e) => {
        setError('');
        const inputValue = e.target.value;
        
        if (!inputValue) {
            setError('Enter Balance');
            setDisable(false);
        } else if (inputValue > 50000) {
            setError('Cannot Add more than $50000');
            setDisable(false);
        } else {
            setAmount(inputValue);
            setDisable(true);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace' && amount.length > 0) {
            setAmount(amount.slice(0, -1));
        }
    };

    const handleSubmit = () => {
        userService.addBalance(userDetails.id, userDetails.role, amount).then((response) => {
            if (response.status === 200) {
                props.setBalanceUpdated(true);
                localStorage.setItem("userDetails", JSON.stringify(response.data));
                alert("Balance added successfully");
            }
        }).catch((error) => {
            if (error.response.status >= 400) {
                alert(error.response.data);
            }
        });
        props.setData(!props.data);
        props.onHide();
    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Balance</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div>
                        <div>
                            <div class="form-floating mb-3 ">
                                <input aria-label="input" type="text" id="amount" class="form-control" placeholder='amount' value={amount} onChange={handleChange} autoComplete="off" autoFocus onBlur={handleChange} onKeyDown={handleKeyDown} />
                                <label for="amount">Amount *</label>
                                {error && <div className="text-danger">{error}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSubmit} disabled={!disable}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default AddBalanceModal