import React, { useEffect, useRef, useState } from 'react';

function RT() {
    const videoRef = useRef(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [cameraError, setCameraError] = useState(null); // State to hold camera error messages

    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    setIsCameraActive(true);
                    detectMultipleFaces(stream); // Call face detection
                }
            } catch (error) {
                // Handle different types of camera access errors
                if (error.name === 'NotAllowedError') {
                    setCameraError('Camera access denied. Please allow camera access to proceed.');
                } else if (error.name === 'NotFoundError') {
                    setCameraError('No camera found. Please ensure your device has a camera.');
                } else {
                    setCameraError('An error occurred while accessing the camera: ' + error.message);
                }
            }
        };

        if (!isCameraActive) {
            startCamera();
        }

        return () => {
            // Clean up: stop all video tracks
            if (videoRef.current) {
                const stream = videoRef.current.srcObject;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }
        };
    }, [isCameraActive]);

    const detectMultipleFaces = (stream) => {
        const faceDetectionInterval = setInterval(() => {
            // Simulated face detection logic
            const facesDetected = Math.random() < 0.5; // Randomly simulate detection (50% chance)

            if (facesDetected) {
                setShowAlert(true);
                clearInterval(faceDetectionInterval); // Stop detection on alert
                // Here, you can take appropriate action, such as ending the quiz or showing an alert
            }
        }, 2000); // Check every 2 seconds
    };

    return (
        <div>
            {cameraError ? ( // Show error message if camera error exists
                <div style={{ color: 'red', fontWeight: 'bold' }}>
                    {cameraError}
                </div>
            ) : (
                <>
                    <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
                    {showAlert && (
                        <div style={{ color: 'red', fontWeight: 'bold' }}>
                            Warning: Multiple faces detected! Please ensure you are the only one in the frame.
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default RT;
