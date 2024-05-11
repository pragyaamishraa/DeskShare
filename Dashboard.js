import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/SideBar';
import RightPanel from '../components/RightPanel';
import backgroundImage from '../images/dashboardBackground.jpg';
import MeetModal from '../components/MeetModal';
import WhiteboardModal from '../components/WhiteboardModal';
import DocumentModal from '../components/DocumentModal';
import { v4 as uuidv4 } from 'uuid';

const FeaturePanel = ({ title, buttonText, description, onClick }) => (
  <div className="bg-[#F5F5F5] rounded-2xl p-6 transition-transform hover:scale-105 hover:shadow-2xl hover:bg-white flex flex-col justify-center items-center">
    <span className="text-2xl font-bold mb-2">{title}</span>
    <button
      aria-label={buttonText}
      className="bg-[#E5E5E5] rounded-full w-full px-3 py-2 text-sm block hover:bg-gray-400 transition-colors duration-300"
      onClick={onClick}
    >
      {buttonText}
    </button>
    <p className="text-gray-500 text-sm">{description}</p>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWhiteboardModalOpen, setIsWhiteboardModalOpen] = useState(false);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
  const [whiteboardName, setWhiteboardName] = useState('');
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);

  const toggleDocumentModal = () => {
    setIsDocumentModalOpen(!isDocumentModalOpen);
  };

  const handleCreateDocument = (documentName) => {
    const documentId = generateUniqueID();
    navigate(`/editDocument/${documentId}`);
    return documentId;
  };

  const handleJoinDocument = (documentId) => {
    navigate(`/editDocument/${documentId}`);
  };

  const generateUniqueID = () => {
    const id = Math.random().toString(36).substr(2, 9);
    localStorage.setItem('generatedID', id);
    return id;
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleWhiteboardModal = () => {
    setIsWhiteboardModalOpen(!isWhiteboardModalOpen);
  };

  const handleCreateWhiteboard = (boardName) => {
    const whiteboardId = uuidv4();
    setWhiteboardName(boardName); // Set the whiteboard name
    navigate(`/whiteboard/${whiteboardId}?name=${encodeURIComponent(boardName)}`);
    return whiteboardId;
  };

  const handleJoinWhiteboard = (whiteboardId) => {
    navigate(`/whiteboard/${whiteboardId}`);
  };

  const handleCreateRoom = () => {
    const roomId = uuidv4();
    navigate(`/meeting/${roomId}`);
  };

  const handleJoinRoom = (roomId) => {
    navigate(`/meeting/${roomId}`);
  };

  const toggleRightPanelVisibility = () => {
    setIsRightPanelVisible((prevState) => !prevState);
  };

  const handleGoToPlanner = () => {
    navigate('/Planner');
  };

  return (
    <div className="flex h-screen" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <Sidebar />
      <div className="flex-1 m-2">
        <div className="shadow-xl rounded-3xl p-8" style={{ background: 'rgba(193, 193, 193, 0.5)', backdropFilter: 'blur(5px)' }}>
          <h1 className="text-3xl font-bold mb-4">Effective Collaboration with DeskShare!</h1>
          <p className="text-white mb-8">Elevate your team's productivity with DeskShare's virtual workspace.</p>
          <div className="grid grid-cols-3 gap-6">
            <FeaturePanel title="Shared Whiteboard" buttonText="Collab" description="Co-author and edit documents" onClick={toggleWhiteboardModal} />
            <FeaturePanel title="Text Editor" buttonText="Edit" description="Real-time Co-authoring" onClick={toggleDocumentModal} />
            <FeaturePanel title="Video Conference" buttonText="Meet" description="Face-to-face collaboration" onClick={toggleModal} />
          </div>
          <h1 className="text-3xl font-bold my-8 mb-4">Free Template To Use:</h1>
          <p className='text-white mb-4'>Plan your tasks so make projects more productive!</p>
          
          <button
            className="bg-white rounded-full px-4 py-2 font-bold text-black hover:bg-gray-200 transition-colors duration-300"
            onClick={handleGoToPlanner}
          >
            Go to Planner
          </button>
        </div>
      </div>
      
      {/* Meet Modal for Video Conference */}
      {isModalOpen && (
        <MeetModal
          onClose={toggleModal}
          onJoinRoom={handleJoinRoom}
          onCreateRoom={handleCreateRoom}
        />
      )}

      {/* Whiteboard Modal for Shared Whiteboard */}
      {isWhiteboardModalOpen && (
        <WhiteboardModal
          onClose={toggleWhiteboardModal}
          onCreateWhiteboard={handleCreateWhiteboard}
          onJoinWhiteboard={handleJoinWhiteboard}
          whiteboardName={whiteboardName} 
        />
      )}

      {/* Document Modal for Document Collaboration */}
      {isDocumentModalOpen && (
        <DocumentModal
          onClose={toggleDocumentModal}
          onCreateDocument={handleCreateDocument}
          onJoinDocument={handleJoinDocument}
        />
      )}

      {/* Toggle right panel button */}
      <button
        onClick={toggleRightPanelVisibility}
        className="fixed top-4 right-4 bg-gray-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-600 transition-colors duration-300"
        aria-label={isRightPanelVisible ? 'Close right panel' : 'Open right panel'}
      >
        {isRightPanelVisible ? '×' : '+'}
      </button>

      {/* Right panel */}
      <RightPanel isVisible={isRightPanelVisible} toggleVisibility={toggleRightPanelVisibility} />
    </div>
  );
};

export default Dashboard;