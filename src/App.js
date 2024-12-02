import React, { useState } from "react";
import './App.css';

function App() {
  // Employees list
  const employeesList = [
   { id: 1, name: "Marc Mabuti" },
    { id: 2, name: "Juvy Aballe" },
    { id: 3, name: "Alaysa Radjac" },
    { id: 4, name: "Casan Macaan" },
  ];

  // State to track selected employee, clock-in/out time, sessions, and total hours
  const [selectedEmployee, setSelectedEmployee] = useState(employeesList[0]); // Default to first employee
  const [sessions, setSessions] = useState({});
  const [clockInTimes, setClockInTimes] = useState({}); // Store clock-in time per employee

  // Function to handle selecting an employee
  const handleEmployeeSelect = (event) => {
    const employee = employeesList.find(emp => emp.id === Number(event.target.value));
    setSelectedEmployee(employee);
  };

  // Function to handle clock-in
  const handleClockIn = () => {
    const currentTime = new Date();
    // Update the clock-in time for the selected employee
    setClockInTimes({
      ...clockInTimes,
      [selectedEmployee.id]: currentTime,
    });
  };

  // Function to handle clock-out
  const handleClockOut = () => {
    if (clockInTimes[selectedEmployee.id]) {
      const currentTime = new Date();
      const workedHours = (currentTime - clockInTimes[selectedEmployee.id]) / 3600000; // Time difference in hours

      const newSession = {
        clockIn: clockInTimes[selectedEmployee.id].toLocaleTimeString(),
        clockOut: currentTime.toLocaleTimeString(),
        hoursWorked: workedHours.toFixed(2),
      };

      const updatedSessions = { ...sessions };
      if (!updatedSessions[selectedEmployee.id]) {
        updatedSessions[selectedEmployee.id] = [];
      }

      updatedSessions[selectedEmployee.id].push(newSession);

      setSessions(updatedSessions);
      setClockInTimes({
        ...clockInTimes,
        [selectedEmployee.id]: null, // Reset clock-in time after clocking out
      });
    }
  };

  // Calculate total hours worked for the selected employee
  const calculateTotalHoursForEmployee = () => {
    if (sessions[selectedEmployee.id]) {
      return sessions[selectedEmployee.id].reduce(
        (total, session) => total + parseFloat(session.hoursWorked),
        0
      );
    }
    return 0;
  };

  return (
    <div className="App">
      <h1>Employee Clock In/Clock Out Tracker</h1>

      {/* Employee Selection */}
      <div className="employee-select">
        <label>Select Employee: </label>
        <select onChange={handleEmployeeSelect} value={selectedEmployee.id}>
          {employeesList.map(employee => (
            <option key={employee.id} value={employee.id}>
              {employee.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display Current Clock In/Clock Out for selected employee */}
      <div className="status">
        {clockInTimes[selectedEmployee.id] ? (
          <p>Clocked in at: {clockInTimes[selectedEmployee.id].toLocaleTimeString()}</p>
        ) : (
          <p>{selectedEmployee.name} hasn't clocked in yet.</p>
        )}
      </div>

      <div className="controls">
        <button onClick={handleClockIn} disabled={clockInTimes[selectedEmployee.id]}>
          Clock In
        </button>
        <button onClick={handleClockOut} disabled={!clockInTimes[selectedEmployee.id]}>
          Clock Out
        </button>
      </div>

      {/* Display Session History for selected employee */}
      <div className="sessions">
        <h2>{selectedEmployee.name}'s Session History</h2>
        <table>
          <thead>
            <tr>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Hours Worked</th>
            </tr>
          </thead>
          <tbody>
            {sessions[selectedEmployee.id] &&
              sessions[selectedEmployee.id].map((session, index) => (
                <tr key={index}>
                  <td>{session.clockIn}</td>
                  <td>{session.clockOut}</td>
                  <td>{session.hoursWorked}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Total Hours for selected employee */}
      <div className="total-hours">
        <h2>Total Hours Worked Today: {calculateTotalHoursForEmployee().toFixed(2)} hours</h2>
      </div>
    </div>
  );
}

export default App;
