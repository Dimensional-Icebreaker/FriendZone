import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import UserGrid from './UserGrid';
import UserCard from './UserCard';
import CreateUserModal from './CreateUserModal';

const ZoneDeck = ({ roomId }) => {
    const [friends, setFriends] = useState([]);
    const [currentRoomId, setCurrentRoomId] = useState(null);  // Start with null

    useEffect(() => {
        if (roomId) {
            setCurrentRoomId(roomId);  // Set roomId only if it's valid
            console.log("Room ID set in ZoneDeck:", roomId);

            // Fetch friends for the given roomId
            fetch(`http://127.0.0.1:5000/api/rooms/${roomId}/friends`)
                .then(response => response.json())
                .then(data => setFriends(data))
                .catch(error => console.error("Error fetching friends:", error));
        } else {
            console.error("Room ID is undefined in ZoneDeck!");
        }
    }, [roomId]);

    return (
        <div>
            <Navbar />

            <h2>Friends in Room {currentRoomId}</h2>

            {friends.length === 0 ? (
                <p>No friends in this room.</p>
            ) : (
                <UserGrid>
                    {friends.map(friend => (
                        <UserCard
                            key={friend.id}
                            name={friend.name}
                            role={friend.role}
                            description={friend.description}
                            gender={friend.gender}
                            imgUrl={friend.img_url}  // Assuming imgUrl is part of friend data
                        />
                    ))}
                </UserGrid>
            )}

            {/* Only render CreateUserModal when currentRoomId is defined */}
            {currentRoomId ? (
                <CreateUserModal roomId={currentRoomId} setUsers={setFriends} />
            ) : (
                <p>Loading room details...</p>
            )}
        </div>
    );
};

export default ZoneDeck;
