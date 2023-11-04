import React, { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import axios from "axios";
import { LinearProgress, Button } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./BlurTool.css";

const BlurTool = ({ src, onBlurredImage, onClose }) => {
  const cropperRef = useRef(null);
  const [allCrops, setAllCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [maxCropHeight, setMaxCropHeight] = useState(0);
  const [maxCropWidth, setMaxCropWidth] = useState(0);

  const handleCropperReady = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;

    setMaxCropHeight(cropper.getCanvasData().naturalHeight);
    setMaxCropWidth(cropper.getCanvasData().naturalWidth);
  };

  const handleZoom = (event) => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
  
    if (event.detail.ratio > 1) {
      // If the image size is greater than its natural size
      cropper.zoomTo(1);
      event.preventDefault();  // Prevent the zoom action
    }
  };
  

  const getCropData = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    return cropper.getData(true);
  };

  const handleCrop = () => {
    const cropData = getCropData();
    setAllCrops([
      ...allCrops,
      [cropData.x, cropData.y, cropData.width, cropData.height],
    ]);
    toast.success("Crop area added successfully!");
  };

  const handleSend = async () => {
    setLoading(true);
    const blob = await fetch(src).then((res) => res.blob());
    const formData = new FormData();
    formData.append("file", blob, "cropped.jpg");
    formData.append("blur_coordinates", JSON.stringify(allCrops));

    try {
      const response = await axios.post(
        "http://localhost:8000/upload/",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            let percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      onBlurredImage(`data:image/png;base64,${response.data.blurred_image}`);
      setSubmitted(true);
      onClose();
      toast.success("Image processed successfully!");
    } catch (error) {
      toast.error("Error uploading the cropped image.");
      setSubmitted(false);
    }
    setLoading(false);
  };

  return (
    <div className="blur-tool-container">
      {loading ? (
        <LinearProgress variant="determinate" value={uploadProgress} />
      ) : (
        <>
          {!submitted && (
            <div className="cropper-container">
              <Cropper
                ref={cropperRef}
                src={src}
                style={{ height: 400, width: "100%" }}
                guides={true}
                background={false}
                dragMode="move"
                cropBoxResizable={true}
                ready={handleCropperReady}
                zoom={handleZoom}
                viewMode={1}
                cropBoxMinWidth={0} // 0 means no restriction
                cropBoxMaxWidth={maxCropWidth} // Infinity means no restriction
                cropBoxMinHeight={50} // Minimum height of 50 pixels for the crop box, adjust as needed
                cropBoxMaxHeight={maxCropHeight}
              />
              <div className="btn-container">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCrop}
                >
                  Add Crop Area
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleSend}
                >
                  Black out
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default BlurTool;
