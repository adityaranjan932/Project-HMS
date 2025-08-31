# Camera Integration Documentation - Project HMS

## Overview
This document explains the camera integration implemented in the Hospital Management System (HMS) student dashboard. The camera functionality allows users to capture photos for maintenance requests and completion verification.

## Implementation Details

### 1. Student Dashboard Camera Integration
**File:** `/frontend/src/pages/Dashboard/Student_Dashboard/MaintenanceRequest.jsx`

#### Purpose
- Students can capture photos of maintenance issues when submitting requests
- Photos are attached to maintenance requests for better issue documentation

#### Technical Implementation

##### State Management
```javascript
// Camera related state
const videoRef = useRef(null);
const canvasRef = useRef(null);
const [photoDataUrl, setPhotoDataUrl] = useState(null);
const [stream, setStream] = useState(null);
const [isCameraOpen, setIsCameraOpen] = useState(false);
const [cameraError, setCameraError] = useState(null);
```

##### Key Functions

1. **startCamera()** - Initializes camera access
```javascript
const startCamera = async () => {
  setCameraError(null);
  setPhotoDataUrl(null); // Clear previous photo
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    setStream(mediaStream);
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
    setIsCameraOpen(true);
  } catch (err) {
    console.error("Error accessing camera:", err);
    setCameraError(
      "Could not access camera. Please ensure permissions are granted and no other app is using it."
    );
    setIsCameraOpen(false);
  }
};
```

2. **capturePhoto()** - Captures image from video stream
```javascript
const capturePhoto = () => {
  if (videoRef.current && canvasRef.current) {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    const context = canvasElement.getContext("2d");
    context.drawImage(
      videoElement,
      0,
      0,
      videoElement.videoWidth,
      videoElement.videoHeight
    );
    const dataUrl = canvasElement.toDataURL("image/jpeg");
    setPhotoDataUrl(dataUrl);
    stopCamera();
  }
};
```

3. **stopCamera()** - Properly closes camera stream
```javascript
const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  setStream(null);
  setIsCameraOpen(false);
};
```

##### UI Components
- **Camera Button**: Orange camera icon button in description textarea
- **Video Preview**: Full-width video element with camera feed
- **Capture Controls**: Green "Capture Photo" and red "Cancel" buttons
- **Photo Preview**: Shows captured image with options to remove or retake
- **Error Display**: Shows camera-related error messages

##### Data Flow
1. User clicks camera button → `startCamera()` is called
2. Browser requests camera permission
3. Video stream displays in `<video>` element
4. User clicks "Capture Photo" → `capturePhoto()` is called
5. Image is drawn to hidden `<canvas>` element
6. Canvas data is converted to base64 using `toDataURL("image/jpeg")`
7. Photo data is stored in `photoDataUrl` state
8. When form is submitted, photo data is included in API payload

### 2. Provost Dashboard Camera Integration
**File:** `/frontend/src/pages/Dashboard/Provost_Dashboard/StudentQueries.jsx`

#### Purpose
- Provost/admin users can capture completion photos when resolving maintenance requests
- Provides visual verification of completed work

#### Enhanced Features
- **Advanced Camera Configuration**: Attempts high-quality settings first, falls back to basic
- **Comprehensive Error Handling**: Specific error messages for different failure scenarios
- **Mobile Optimization**: Uses "environment" facing mode for back camera

##### Advanced Camera Setup
```javascript
// Try different camera configurations for better compatibility
let mediaStream;
try {
  // First try with preferred settings
  mediaStream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      facingMode: "environment", // Use back camera if available
    },
  });
} catch (err) {
  // Fallback to basic video constraints
  mediaStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
}
```

##### Enhanced Error Handling
```javascript
let errorMessage = "Could not access camera. ";

if (err.name === "NotFoundError" || err.name === "DeviceNotFoundError") {
  errorMessage += "No camera device found on this device.";
} else if (
  err.name === "NotAllowedError" ||
  err.name === "PermissionDeniedError"
) {
  errorMessage +=
    "Camera permission denied. Please allow camera access in your browser settings.";
} else if (err.name === "NotSupportedError") {
  errorMessage += "Camera is not supported on this browser.";
} else if (err.name === "NotReadableError") {
  errorMessage += "Camera is already in use by another application.";
} else {
  errorMessage +=
    err.message || "Please check your camera settings and try again.";
}
```

## Browser API Usage

### getUserMedia API
- **Purpose**: Access device camera and microphone
- **Browser Support**: Modern browsers (Chrome 53+, Firefox 36+, Safari 11+)
- **Permissions**: Requires user permission grant
- **Security**: HTTPS required for camera access (except localhost)

### Canvas API
- **Purpose**: Draw video frames and convert to image data
- **Method**: `getContext("2d")` for 2D rendering
- **Output**: Base64 encoded JPEG images via `toDataURL()`

### Video Element
- **Attributes**: `autoPlay`, `playsInline` for seamless streaming
- **Source**: Set via `srcObject` property with MediaStream

## Data Handling

### Image Storage
- **Format**: JPEG (via `toDataURL("image/jpeg")`)
- **Encoding**: Base64 data URLs
- **Storage**: Temporarily in component state, sent to backend via API
- **Transmission**: Included in form payload to backend endpoints

### API Integration
```javascript
// Student maintenance request
const payload = { requestType, description, priority };
if (photoDataUrl) {
  payload.photo = photoDataUrl;
}
const response = await apiConnector(
  "POST",
  "/service-requests",
  payload,
  { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
);
```

## Cleanup and Memory Management

### Stream Cleanup
```javascript
// Cleanup camera stream on component unmount
useEffect(() => {
  return () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };
}, [stream]);
```

### Track Management
- All media tracks are properly stopped when:
  - Component unmounts
  - Camera is manually stopped
  - Photo is captured
  - Modal is closed

## User Experience Features

### Visual States
1. **Initial State**: Camera button visible in textarea corner
2. **Camera Active**: Video preview with capture/cancel buttons
3. **Photo Captured**: Image preview with remove/retake options
4. **Error State**: Error message with explanation and suggestions

### Responsive Design
- Mobile-friendly video sizing (`max-h-80`)
- Flexible button layouts (`flex-col sm:flex-row`)
- Touch-friendly button sizes and spacing

### Accessibility
- Clear button labels and icons
- Error messages with actionable guidance
- Proper focus management
- Screen reader compatible

## Security Considerations

### Browser Permissions
- Camera access requires explicit user permission
- HTTPS required for camera access in production
- Permission state is managed by browser, not application

### Data Privacy
- Images are processed client-side before transmission
- No persistent client-side storage of image data
- Images sent securely via HTTPS to backend

## Browser Compatibility

### Supported Browsers
- **Chrome**: 53+ (full support)
- **Firefox**: 36+ (full support)
- **Safari**: 11+ (full support)
- **Edge**: 79+ (full support)

### Fallback Handling
- Graceful degradation for unsupported browsers
- Clear error messages for compatibility issues
- Alternative image upload methods could be implemented

## Future Enhancements

### Potential Improvements
1. **Image Compression**: Reduce file size before transmission
2. **Multiple Photos**: Allow capturing multiple images per request
3. **Image Editing**: Basic crop/rotate functionality
4. **File Upload Alternative**: Fallback to file picker for camera-less devices
5. **Image Quality Options**: User-selectable quality settings

### Performance Optimizations
1. **Lazy Loading**: Initialize camera only when needed
2. **Stream Reuse**: Maintain camera stream across multiple captures
3. **Progressive Upload**: Upload images in background
4. **Caching**: Client-side caching for repeated operations

## Troubleshooting

### Common Issues
1. **Permission Denied**: User must grant camera access in browser
2. **Camera in Use**: Close other applications using camera
3. **HTTPS Required**: Ensure site runs on HTTPS in production
4. **Browser Compatibility**: Update to supported browser version

### Debug Information
- Check browser console for detailed error messages
- Verify HTTPS certificate in production
- Test camera access in other applications
- Check browser permission settings

## Dependencies

### Frontend Dependencies
- **React**: 19.0.0+ (hooks support required)
- **react-icons**: 5.5.0+ (for UI icons)
- **react-hot-toast**: 2.5.2+ (for notifications)

### Browser APIs
- **MediaDevices.getUserMedia()**: Camera access
- **HTMLCanvasElement**: Image processing
- **HTMLVideoElement**: Video streaming

## Conclusion

The camera integration in Project HMS provides a robust, user-friendly way to capture and attach images to maintenance requests. The implementation follows modern web standards, includes comprehensive error handling, and provides a smooth user experience across devices and browsers.

The dual implementation (student and provost dashboards) demonstrates the flexibility of the system and provides different user experiences appropriate for each role's needs.