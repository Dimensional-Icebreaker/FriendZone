// App.jsx
import React, { useState, useEffect } from 'react';
import RoomPage from './components/RoomPage';  
import Zone from './components/Zone';  // Import Zone instead of ZoneDeck

// Ensure this is exported
export const BASE_URL = "https://zonedeck.onrender.com";  // Adjust as per your backend URL "http://127.0.0.1:5000"

const App = () => {
    const [currentRoomId, setCurrentRoomId] = useState(null);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        fetch(`${BASE_URL}/api/rooms`)
            .then(response => response.json())
            .then(data => setRooms(data))
            .catch(error => console.error("Error fetching rooms:", error));
    }, []);

    const handleRoomSelect = (roomId) => {
        console.log("Selected Room ID:", roomId);  // Debugging statement to check roomId
        setCurrentRoomId(roomId);
    };

    const handleAddRoom = (newRoom) => {
        fetch(`${BASE_URL}/api/rooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newRoom)
        })
        .then(response => response.json())
        .then(room => setRooms([...rooms, room]))
        .catch(error => console.error("Error adding room:", error));
    };

    return (
        <div>
            {!currentRoomId ? (
                <RoomPage 
                    rooms={rooms} 
                    onRoomSelect={handleRoomSelect} 
                    onAddRoom={handleAddRoom}  
                />
            ) : (
                <>
                    <Zone room_id={currentRoomId} />  {/* Verify that currentRoomId is passed correctly */}
                </>
            )}
        </div>
    );
};

export default App;
