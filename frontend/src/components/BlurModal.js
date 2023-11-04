// BlurModal.js
import React from 'react';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import BlurTool from './BlurTool';
import "./BlurModal.css";

const BlurModal = ({ open, src, onBlurredImage, onClose }) => {
    return (
        <Modal open={open} onClose={onClose} className="modal">
            <div className="modal-content">
                <BlurTool src={src} onBlurredImage={onBlurredImage} onClose={onClose}/>
            </div>
        </Modal>
    );
}

export default BlurModal;
