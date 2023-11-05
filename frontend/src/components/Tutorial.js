import React from 'react';
import { Modal, Carousel } from 'react-bootstrap';
import "./Tutorial.css"

function Tutorial({ show, onClose }) {
  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Getting Started with Veilify</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel>
          <Carousel.Item>
            <div className="tutorial-step">
              <h3>Step 1: Upload Your Image</h3>
              <p>Begin by dragging and dropping your image into the designated area, or click to browse your files and select the image you wish to edit.</p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="tutorial-step">
              <h3>Step 2: Black Out Sensitive Areas</h3>
              <p>Highlight the portions of your image that you want to veil. Use the cropping tool to mark areas to be blacked out, ensuring your sensitive information is kept confidential.</p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="tutorial-step">
              <h3>Step 3: Processing Your Image</h3>
              <p>Once you've selected all areas to black out, submit your image for processing. Wait for a moment as our tool applies the black-out effect to your specified regions.</p>
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <div className="tutorial-step">
              <h3>Step 4: Download and Go</h3>
              <p>After the processing is complete, download your edited image with the blacked-out areas. Your image is now ready to be shared with enhanced privacy.</p>
            </div>
          </Carousel.Item>
        </Carousel>
      </Modal.Body>
    </Modal>
  );
}

export default Tutorial;
