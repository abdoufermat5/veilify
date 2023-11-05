import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Modal } from "react-bootstrap";
import BlurTool from "./components/BlurTool";
import Tutorial from "./components/Tutorial";
import Button from "@material-ui/core/Button";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { ToastContainer, toast } from "react-toastify";
import veilifyIcon from "./assets/veilify.jpeg";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [image, setImage] = useState(null);
  const [blurredImage, setBlurredImage] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const [showTutorial, setShowTutorial] = useState(false);

  const resetImage = () => {
    setImage(null);
    setBlurredImage(null);
  };

  const handleClose = () => setModalOpen(false);

  const onDropRejected = useCallback((fileRejections) => {
    setModalOpen(false);
    // Only show the warning for the first rejected file
    const { errors } = fileRejections[0];
    errors.forEach((error) => {
      if (error.code === "file-invalid-type") {
        toast.warn("Only image files are accepted!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (error.code === "file-too-large") {
        toast.warn("File is too large! Compress it then come back", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    });
  }, []);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file.type.startsWith("image/")) {
        // Manually trigger the rejection handler if the file is not an image
        onDropRejected([{ file, errors: [{ code: "file-invalid-type" }] }]);
        return;
      }

      const maxSize = 10000000; // Your size limit here (10MB example)
      if (file.size > maxSize) {
        // Manually trigger the rejection handler if the file is too large
        onDropRejected([{ file, errors: [{ code: "file-too-large" }] }]);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setModalOpen(true); // <-- Open the modal when image is loaded
      };
      reader.readAsDataURL(file);
    },
    [onDropRejected]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    accept: "image/*",
    maxSize: 10000000, // 10mb max
    multiple: false,
  });

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("tutorialShown", "true");
  };

  useEffect(() => {
    const tutorialShown = localStorage.getItem("tutorialShown");
    if (!tutorialShown) {
      setShowTutorial(true);
    }
  }, []);

  return (
    <>
      <ToastContainer />
      {showTutorial && <Tutorial show={showTutorial} onClose={closeTutorial} />}
      <header className="App-header">
        <img src={veilifyIcon} alt="Veilify Icon" className="veilify-icon" />
        Veilify
      </header>
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
            <p className="animated-text">
              Drag & drop an image here, or click to select one
            </p>
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
