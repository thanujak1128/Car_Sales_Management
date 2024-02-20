import React from "react";
import { Modal } from "react-bootstrap";
import { formatDate } from "../Helper/Helper";

const ViewOrderModal = (props) => {

    const selectedOrder = props.selectedOrder;
    const totalPrice = props.selectedOrder.totalPrice;
    const commissionPercent = selectedOrder.vehicle?.commisionPercentage;
    const adminShare = ((totalPrice * commissionPercent) / 100).toFixed(2);
    const sellerShare = (totalPrice - adminShare).toFixed(2);

    return (
        <Modal {...props} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Order Information
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    <div className="col">
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="carName" className="form-control-plaintext" value={selectedOrder.vehicle?.carName} />
                            <label htmlFor="carName">Car Name</label>
                        </div>
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="biddingPrice" className="form-control-plaintext" value={`$${selectedOrder.payablePrice}`} />
                            <label htmlFor="biddingPrice">Bidding Price</label>
                        </div>
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="sellerShare" className="form-control-plaintext" value={`$${sellerShare}`} />
                            <label htmlFor="sellerShare">Seller Share</label>
                        </div>
                        {selectedOrder.requestedDate && <div className="form-floating">
                            <input aria-label="text input" type="text" id="requestedDate" className="form-control-plaintext" value={`${formatDate(selectedOrder.requestedDate)}`} />
                            <label htmlFor="requestedDate">Request Date</label>
                        </div>}
                    </div>
                    <div className="col">
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="totalPrice" className="form-control-plaintext" value={`$${selectedOrder.totalPrice}`} />
                            <label htmlFor="totalPrice">Total Price</label>
                        </div>
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="shippingCharges" className="form-control-plaintext" value={`$${selectedOrder.shippingCharges}`} />
                            <label htmlFor="shippingCharges">Shipping Charges</label>
                        </div>
                        <div className="form-floating">
                            <input aria-label="text input" type="text" id="adminShare" className="form-control-plaintext" value={`$${adminShare}`} />
                            <label htmlFor="adminShare">Admin Share</label>
                        </div>
                        {selectedOrder.soldDate && <div className="form-floating">
                            <input aria-label="text input" type="text" id="soldDate" className="form-control-plaintext" value={`${formatDate(selectedOrder.soldDate)}`} />
                            <label htmlFor="soldDate">Sold Date</label>
                        </div>}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ViewOrderModal;