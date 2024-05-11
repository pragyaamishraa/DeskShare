import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const Planner = () => {
  // State variables for tasks, deadlines, and meetings
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(Array(10).fill(''));
  const [deadlines, setDeadlines] = useState(Array(10).fill({ task: '', date: '' }));
  const [meetings, setMeetings] = useState(Array(10).fill({ task: '', date: '' }));

  // State variables for checkbox state
  const [taskChecked, setTaskChecked] = useState(Array(10).fill(false));
  const [deadlineChecked, setDeadlineChecked] = useState(Array(10).fill(false));
  const [meetingChecked, setMeetingChecked] = useState(Array(10).fill(false));

  // Ref for the planner container
  const plannerRef = useRef(null);

  const handleBackToDashboard = () => {
    navigate('/dashboard'); // Redirect to "/dashboard" route
  };

  // Function to handle adding task on Enter key press
  const handleTaskInputKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTasks = [...tasks];
      newTasks[index] = e.target.value;
      setTasks(newTasks);
      setTaskChecked([...taskChecked.slice(0, index), false, ...taskChecked.slice(index + 1)]);
      e.target.value = '';
    }
  };

  // Function to handle adding deadline on Enter key press
  const handleDeadlineInputKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newDeadlines = [...deadlines];
      newDeadlines[index] = { task: e.target.value, date: e.target.nextSibling.value };
      setDeadlines(newDeadlines);
      setDeadlineChecked([...deadlineChecked.slice(0, index), false, ...deadlineChecked.slice(index + 1)]);
      e.target.value = '';
      e.target.nextSibling.value = '';
    }
  };

  // Function to handle adding meeting on Enter key press
  const handleMeetingInputKeyPress = (e, index) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newMeetings = [...meetings];
      newMeetings[index] = { task: e.target.value, date: e.target.nextSibling.value };
      setMeetings(newMeetings);
      setMeetingChecked([...meetingChecked.slice(0, index), false, ...meetingChecked.slice(index + 1)]);
      e.target.value = '';
      e.target.nextSibling.value = '';
    }
  };

  // Function to generate and save PDF
  const handleSaveAsPDF = () => {
    const plannerElement = plannerRef.current;
    const plannerWidth = document.documentElement.clientWidth;
    const plannerHeight = plannerElement.offsetHeight;
    const doc = new jsPDF('p', 'pt', [plannerWidth, plannerHeight]);
    doc.html(plannerElement, {
      html2canvas: {
        scale: 0.5, // Adjust scale as needed
      },
      callback: () => {
        doc.save('planner.pdf');
      }
    });
  };

  return (
    <div>
      <div className="planner-container" ref={plannerRef}>
        <div className="column">
          <h2 className='mb-6'>PRIORITY TASKS</h2>
          {tasks.map((task, index) => (
            <li key={index}>
              <input
                type="text"
                placeholder={`Task ${index + 1}`}
                value={task}
                onChange={(e) => setTasks([...tasks.slice(0, index), e.target.value, ...tasks.slice(index + 1)])}
                onKeyPress={(e) => handleTaskInputKeyPress(e, index)}
              />
              {task && <input type="checkbox" checked={taskChecked[index]} onChange={() => setTaskChecked([...taskChecked.slice(0, index), !taskChecked[index], ...taskChecked.slice(index + 1)])} />}
            </li>
          ))}
        </div>
        <div className="column">
          <h2 className='mb-6'>DEADLINES</h2>
          {deadlines.map((deadline, index) => (
            <li key={index}>
              <input
                type="text"
                placeholder={`Deadline ${index + 1}`}
                value={deadline.task}
                onChange={(e) => setDeadlines([...deadlines.slice(0, index), { task: e.target.value, date: deadlines[index].date }, ...deadlines.slice(index + 1)])}
                onKeyPress={(e) => handleDeadlineInputKeyPress(e, index)}
              />
              <input
                type="date"
                value={deadline.date}
                onChange={(e) => setDeadlines([...deadlines.slice(0, index), { task: deadlines[index].task, date: e.target.value }, ...deadlines.slice(index + 1)])}
              />
              {deadline.task && <input type="checkbox" checked={deadlineChecked[index]} onChange={() => setDeadlineChecked([...deadlineChecked.slice(0, index), !deadlineChecked[index], ...deadlineChecked.slice(index + 1)])} />}
            </li>
          ))}
        </div>
        <div className="column">
          <h2 className='mb-6'>UPCOMING MEETINGS</h2>
          {meetings.map((meeting, index) => (
            <li key={index}>
              <input
                type="text"
                placeholder={`Meeting ${index + 1}`}
                value={meeting.task}
                onChange={(e) => setMeetings([...meetings.slice(0, index), { task: e.target.value, date: meetings[index].date }, ...meetings.slice(index + 1)])}
                onKeyPress={(e) => handleMeetingInputKeyPress(e, index)}
              />
              <input
                type="date"
                value={meeting.date}
                onChange={(e) => setMeetings([...meetings.slice(0, index), { task: meetings[index].task, date: e.target.value }, ...meetings.slice(index + 1)])}
              />
              {meeting.task && <input type="checkbox" checked={meetingChecked[index]} onChange={() => setMeetingChecked([...meetingChecked.slice(0, index), !meetingChecked[index], ...meetingChecked.slice(index + 1)])} />}
            </li>
          ))}
        </div>
      </div>
      <button className="save-pdf-btn" onClick={handleSaveAsPDF}>Save as PDF</button>
      <button className="back-btn" onClick={handleBackToDashboard}>Back</button>
      <style>{`
        .planner-container {
          display: flex;
          justify-content: space-around;
          margin-top: 50px;
          position: relative;
        }
        
        .back-btn {
          position: fixed;
          top: 20px;
          left: 20px; /* Position the button in the top left corner */
          padding: 10px 20px;
          background-color: grey;
          color: black;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          z-index: 999;
        }

        .column {
          flex: 1;
          padding: 20px;
          border-radius: 0; /* Sharp edges */
          color: black;
          margin: 10px;
          text-align: center; /* Center align the headings */
          position: relative; /* Add relative positioning */
        }
        
        .column:not(:last-child) {
          border-right: 1px solid #ccc; /* Grey divider between columns */
        }
        
        input[type="text"] {
          width: calc(100% - 16px); /* Adjusting for padding */
          margin-bottom: 10px;
          padding: 8px;
          border-radius: 5px;
          border: none;
          outline: none;
        }
        
        input[type="date"] {
          width: calc(100% - 16px); /* Adjusting for padding */
          margin-bottom: 10px;
          padding: 8px;
          border-radius: 5px;
          border: none;
          outline: none;
        }
        
        ul {
          list-style-type: none;
          padding: 0;
          margin-top: 20px; /* Add margin to separate the list */
          position: absolute; /* Position below the horizontal divider */
          bottom: 0; /* Align to the bottom */
          width: 100%; /* Full width */
          left: 0; /* Align to the left */
          text-align: left; /* Align text to the left */
        }
        
        li {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        
        h2 {
          color:black;
          font-size: 24px;
          font-weight: bold;
          font-family: monospace;
          margin-bottom: 20px; /* Increased margin */
        }

        .save-pdf-btn {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 10px 20px;
          background-color: grey;
          color: black;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          z-index: 999;
        }
      `}</style>
    </div>
  );
};

export default Planner;
