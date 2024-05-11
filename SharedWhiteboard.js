import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faFont, faEraser, faTrash, faFileUpload, faSave } from '@fortawesome/free-solid-svg-icons';
import { SketchPicker } from 'react-color';

const SharedWhiteboard = () => {
  const { whiteboardId } = useParams();
  const canvasRef = useRef(null);
  const socketRef = useRef();
  const fileInputRef = useRef(null);
  const [whiteboardName, setWhiteboardName] = useState('');
  const [drawingContext, setDrawingContext] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState(null);
  const [textBox, setTextBox] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [doubleTapDelay, setDoubleTapDelay] = useState(300);
  const [eraserBox, setEraserBox] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [eraserSize, setEraserSize] = useState(20);
  const [penSize, setPenSize] = useState(2);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [penColor, setPenColor] = useState('#000'); 
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const name = queryParams.get('name');
    setWhiteboardName(name);

    socketRef.current = socketIOClient('http://localhost:5000/socket.io/');
    socketRef.current.emit('joinRoom', whiteboardId);

    socketRef.current.on('draw', (data) => {
      const { type, ...options } = data;
      if (type === 'pen') {
        drawPen(options);
      } else if (type === 'text') {
        drawText(options);
      }
    });

    socketRef.current.on('erase', (data) => {
      const { x, y, width, height } = data;
      drawingContext.clearRect(x, y, width, height);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [whiteboardId]);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      setDrawingContext(ctx);
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const handleWheel = (event) => {
      event.preventDefault();
      if (event.deltaY < 0) {
        setZoomLevel(zoomLevel * 1.1);
      } else {
        setZoomLevel(zoomLevel * 0.9);
      }
    };
    canvas.addEventListener('wheel', handleWheel);
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [zoomLevel]);

  const handleBackToDashboard = () => {
    navigate('/dashboard'); // Redirect to "/dashboard" route
  };

  const toggleTool = (selectedTool) => {
    if (selectedTool === tool) {
      // If the selected tool is already active, close the range bars
      setTool(null);
      setShowColorPicker(false);
    } else {
      setTool(selectedTool);
      setShowColorPicker(selectedTool === 'pen'); // Show color picker only for the pen tool
    }
  };

  const startDrawing = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (tool === 'pen') {
      const currentTime = new Date().getTime();
      if (currentTime - lastClickTime < doubleTapDelay) {
        setIsDrawing(false);
      } else {
        setIsDrawing(true);
      }
      setLastClickTime(currentTime);
      drawingContext.beginPath();
      drawingContext.moveTo(offsetX, offsetY);
      drawPen({ startX: offsetX, startY: offsetY }, penColor); // Pass penColor here
    } else if (tool === 'text') {
      setTextBox({ x: offsetX, y: offsetY });
    } else if (tool === 'eraser') {
      setEraserBox({ x: offsetX, y: offsetY });
    } else if (tool === 'upload') {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.onload = () => {
          drawingContext.drawImage(image, 0, 0);
        };
        image.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const continueDrawing = (event) => {
    if (isDrawing) {
      const { offsetX, offsetY } = event.nativeEvent;
      drawingContext.lineTo(offsetX, offsetY);
      drawingContext.stroke();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const drawPen = (options, color) => {
    const { startX, startY, endX, endY } = options;
    drawingContext.beginPath();
    drawingContext.moveTo(startX, startY);
    drawingContext.lineTo(endX, endY);
    drawingContext.strokeStyle = color; // Use the color passed as an argument
    drawingContext.lineWidth = penSize;
    drawingContext.stroke();
  };

  const drawText = (options) => {
    const { text, x, y, color, font } = options;
    drawingContext.fillStyle = color;
    drawingContext.font = font;
    drawingContext.fillText(text, x, y);
  };

  const drawEraser = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (eraserBox) {
      const { x, y } = eraserBox;
      drawingContext.clearRect(x, y, eraserSize, eraserSize);
      socketRef.current.emit('erase', { x, y, width: eraserSize, height: eraserSize });
      setEraserBox({ x: offsetX, y: offsetY });
    }
  };

  const handleCanvasClick = (event) => {
    const { offsetX, offsetY } = event.nativeEvent;
    if (tool === 'pen') {
      startDrawing(event);
    } else if (tool === 'text') {
      setTextBox({ x: offsetX, y: offsetY });
    } else if (tool === 'eraser') {
      setEraserBox({ x: offsetX, y: offsetY });
    }
  };

  const handleTextBoxBlur = () => {
    if (textBox && textBox.text) {
      const text = textBox.text.trim();
      if (text) {
        drawText({ text, x: textBox.x, y: textBox.y, color: '#000', font: '14px Arial' });
        socketRef.current.emit('draw', { type: 'text', text, x: textBox.x, y: textBox.y, color: '#000', font: '14px Arial' });
      }
    }
    setTextBox(null);
  };

  const handleTextBoxChange = (event) => {
    if (textBox) {
      setTextBox({ ...textBox, text: event.target.value });
    }
  };

  const clearCanvas = () => {
    drawingContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    socketRef.current.emit('clear');
  };

  const saveCanvas = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'whiteboard.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleColorPicker = () => {
    setShowColorPicker((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Whiteboard: {whiteboardName}</h1>
      <p>Room ID: {whiteboardId}</p>
      <div className="flex">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{ border: '1px solid black', cursor: tool === 'eraser' ? `url('https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Eraser_icon.svg/512px-Eraser_icon.svg.png'), auto` : 'crosshair', transform: `scale(${zoomLevel})` }}
          onClick={handleCanvasClick}
          onMouseMove={tool === 'eraser' ? drawEraser : continueDrawing}
          onMouseUp={stopDrawing}
        ></canvas>
        <div className="flex flex-col ml-4">
        <button
        className="absolute top-4 left-4 px-4 py-2 bg-gray-500 text-black rounded-md cursor-pointer z-10"
        onClick={handleBackToDashboard}
      >
        Back
      </button>
  <button className={tool === 'pen' ? 'active' : ''} onClick={() => toggleTool('pen')}><FontAwesomeIcon icon={faPen} /></button>
  <button className={tool === 'text' ? 'active' : ''} onClick={() => toggleTool('text')}><FontAwesomeIcon icon={faFont} /></button>
  <button className={tool === 'eraser' ? 'active' : ''} onClick={() => toggleTool('eraser')}><FontAwesomeIcon icon={faEraser} /></button>
  <button className={tool === 'upload' ? 'active' : ''}>
    <label htmlFor="uploadFile"><FontAwesomeIcon icon={faFileUpload} /></label>
    <input id="uploadFile" type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileInputChange} />
  </button>
  <button onClick={clearCanvas}><FontAwesomeIcon icon={faTrash} /></button>
  <button onClick={saveCanvas}><FontAwesomeIcon icon={faSave} /></button>
  {showColorPicker && tool === 'pen' && (
    <SketchPicker color={penColor} onChange={(color) => setPenColor(color.hex)} />
  )}
  {tool === 'pen' && (
    <div>
      <label htmlFor="penSize">Pen Size:</label>
      <input type="range" id="penSize" min="1" max="20" value={penSize} onChange={(e) => setPenSize(parseInt(e.target.value))} />
    </div>
  )}
  {tool === 'eraser' && (
    <div>
      <label htmlFor="eraserSize">Eraser Size:</label>
      <input type="range" id="eraserSize" min="1" max="50" value={eraserSize} onChange={(e) => setEraserSize(parseInt(e.target.value))} />
    </div>
  )}
</div>

      </div>
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileInputChange} />
    </div>
  );
};

export default SharedWhiteboard;
