import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const ToastMsg = (props) => {

  const toggle = () => { props.setIsOpen(!props.show) };

  setTimeout(() => {
    props.setIsOpen(false)
  }, 5000);

  return (
    <ToastContainer position="bottom-start" className="p-3 w-100" style={{ zIndex: 1 }}>
      <Toast show={props.show} onClose={toggle} style={{ "width": "25%", "height": "10vh" }}>
        <Toast.Header className='bg-primary'>

          <strong className="me-auto text-white">Alert</strong>
        </Toast.Header>
        <Toast.Body className='fs-3'>{props.message}</Toast.Body>
      </Toast>
    </ToastContainer>
  )
}

export default ToastMsg