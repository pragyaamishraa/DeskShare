import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from 'react-router-dom';
import Login from './pages/Login';
import SignInPage from './pages/SignInPage';
import AboutUs from './pages/AboutUs';
import Info from './pages/Info';
import Welcome from './pages/welcome';
import Dashboard from './pages/Dashboard';
import Main from './components/Main';
import NavBar from './components/NavBar';
import MeetModal from './components/MeetModal';
import MeetingPage from './pages/MeetingPage';
import WhiteboardModal from './components/WhiteboardModal';
import SharedWhiteboard from './pages/SharedWhiteboard';
import EditDocument from './pages/EditDocument';
import DocumentModal from './components/DocumentModal';
import Planner from './pages/Planner';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/info" element={<Info />} />
      <Route path="/" element={<Main />}>
        <Route path="/" element={<NavBar />} />
      </Route>
      <Route path="/*" element={<Welcome />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/WhiteboardModal" element={<WhiteboardModal />} />
      <Route path="/whiteboard/:whiteboardId" element={<SharedWhiteboard />} />
      <Route path="/DocumentModal" element={<DocumentModal />} />
      <Route path="/EditDocument/:roomID" element={<EditDocument />} />
      <Route path="/MeetModal" element={<MeetModal />} />
      <Route path="/meeting/:roomId" element={<MeetingPage />} />
      <Route path="/Planner" element={<Planner />} />
    </>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

reportWebVitals();