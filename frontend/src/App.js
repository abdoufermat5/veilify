import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Modal } from "react-bootstrap";
import BlurTool from "./components/BlurTool";
import Button from "@material-ui/core/Button";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [image, setImage] = useState(null);
  const [blurredImage, setBlurredImage] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const resetImage = () => {
    setImage(null);
    setBlurredImage(null);
  };

  const handleClose = () => setModalOpen(false);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
      setModalOpen(true); // <-- Open the modal when image is loaded
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    multiple: false,
  });

  return (
    <>
      <header className="App-header">Veilify</header>
      <div className="App-description">
        <div className="content-desc">
          <p>
            Welcome to Veilify - the app that lets you black out parts of your
            images with ease! Just drop an image and let us do the magic.
          </p>
        </div>
      </div>
      <div className="App">
        {!image ? (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag & drop an image here, or click to select one</p>
          </div>
        ) : (
          <div className="images-container">
            <img
              alt="Original Image"
              src={image}
              onClick={() => setModalOpen(true)}
              className="original-image"
            />
            <Modal
              show={isModalOpen}
              onHide={handleClose}
              backdrop="static"
              keyboard={false}
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>Crop areas to black out</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <BlurTool
                  src={image}
                  onBlurredImage={setBlurredImage}
                  onClose={handleClose}
                />
              </Modal.Body>
            </Modal>
            );
            {blurredImage && (
              <div className="image-and-download">
                <img
                  alt="Blacked Out Image"
                  src={blurredImage}
                  className="blurred-image"
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  className="download-button"
                  startIcon={<CloudDownloadIcon />}
                >
                  <a
                    href={blurredImage}
                    download="blacked-out-image.jpg"
                    className="download-link"
                  >
                    Download
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}
        <footer className="App-footer">
          <span>@abdoufermat</span>
          <a
            href="https://github.com/abdoufermat5"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>{" "}
          <a
            href="https://www.linkedin.com/in/abdou-yaya-sadiakhou-40a94b1a3"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>{" "}
        </footer>
      </div>
    </>
  );
}

export default App;
