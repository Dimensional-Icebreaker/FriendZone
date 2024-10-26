import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Container,
  Grid,
  IconButton,
  Tooltip, // Add Tooltip for better UX
} from "@chakra-ui/react";
import Navbar_Roompage from './Navbar_Roompage';
import { BiTrash } from "react-icons/bi";


const RoomPage = ({ onRoomSelect }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({ name: "", password: "" });
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Password modal states
  const {
    isOpen: isPasswordOpen,
    onOpen: onPasswordOpen,
    onClose: onPasswordClose,
  } = useDisclosure();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  // Modal to confirm password for deletion
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();

  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch("/api/rooms");
      const data = await response.json();
      setRooms(data);
    };
    fetchRooms();
  }, []);

  // Handle new room addition
  const handleAddRoom = async () => {
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRoom),
    });
    const addedRoom = await res.json();
    setRooms([...rooms, addedRoom]);
    setNewRoom({ name: "", password: "" });
    onClose();
  };

  // Handle room selection (with password check)
  const handleRoomSelect = (room) => {
    setSelectedRoom(room); // Set the selected room
    setErrorMessage(''); // Reset error message
    onPasswordOpen(); // Open password modal
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch(`/api/rooms/${selectedRoom.id}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ access_password: passwordInput }),
      });

      const result = await response.json();

      if (response.ok) {
        // Password verified, proceed to enter the room
        onRoomSelect(selectedRoom.id); // Call the function to access the room
        onPasswordClose(); // Close the password modal
      } else {
        setErrorMessage(result.error || "Incorrect password!"); // Show error if password is incorrect
      }
    } catch (error) {
      setErrorMessage('Error verifying password. Please try again.');
      console.error('Error verifying password:', error);
    }
  };

  // Handle delete room with password verification
  const handleDeleteRoom = async (room) => {
    setSelectedRoom(room);
    onDeleteModalOpen(); // Open modal to verify password for deletion
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await fetch(`/api/rooms/${selectedRoom.id}/verify_admin_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_password: passwordInput }),
      });

      const result = await response.json();

      if (response.ok) {
        // Password verified, proceed to delete room
        await fetch(`/api/rooms/${selectedRoom.id}/delete`, {
          method: 'DELETE',
        });

        // Update the room list after deletion
        setRooms(rooms.filter((room) => room.id !== selectedRoom.id));
        onDeleteModalClose(); // Close delete modal
      } else {
        setErrorMessage(result.error || "Incorrect password!"); // Show error if password is incorrect
      }
    } catch (error) {
      setErrorMessage('Error verifying password. Please try again.');
      console.error('Error verifying password:', error);
    }
  };

  // Split rooms into four arrays for the four containers
  const splitRooms = () => {
    const container1 = [];
    const container2 = [];
    const container3 = [];
    const container4 = [];

    rooms.forEach((room, index) => {
      if (index % 4 === 0) {
        container1.push(room);
      } else if (index % 4 === 1) {
        container2.push(room);
      } else if (index % 4 === 2) {
        container3.push(room);
      } else {
        container4.push(room);
      }
    });

    return { container1, container2, container3, container4 };
  };

  const { container1, container2, container3, container4 } = splitRooms();

  return (
    <>
      <Navbar_Roompage setRooms={setRooms} />
      <Container maxW={"1200px"} my={4}>
        <Text
          fontSize={{ base: "3xl", md: "50" }}
          fontWeight={"bold"}
          letterSpacing={"2px"}
          textTransform={"uppercase"}
          textAlign={"center"}
          mb={8}
        >
          <Text as={"span"} bgGradient={"linear(to-r, cyan.400, blue.500)"} bgClip={"text"}>
            ROOMS
          </Text>
        </Text>
      </Container>

      <VStack align="center" justify="center" p="6">
        <Grid templateColumns="repeat(4, 1fr)" gap={6}>
          {/* Container 1 */}
          <VStack borderRight="2px solid gray" p="4">
            {container1.length ? (
              container1.map((room) => (
                <Box key={room.id} display="flex" justifyContent="space-between" alignItems="center" w="full">
                  <Button onClick={() => handleRoomSelect(room)}>{room.name}</Button>
                  <Tooltip label="Delete Room" aria-label="Delete Room Tooltip">
                    <IconButton
                      icon={<BiTrash />}
                      onClick={() => handleDeleteRoom(room)}
                      aria-label="Delete Room"
                    />
                  </Tooltip>
                </Box>
              ))
            ) : (
              <Text>No rooms available.</Text>
            )}
          </VStack>

          {/* Repeat for the other containers */}
          {/* Container 2 */}
          <VStack borderRight="2px solid gray"  p="4">
            {container2.length ? (
              container2.map((room) => (
                <Box key={room.id} display="flex" justifyContent="space-between" alignItems="center" w="full">
                  <Button onClick={() => handleRoomSelect(room)}>{room.name}</Button>
                  <Tooltip label="Delete Room" aria-label="Delete Room Tooltip">
                    <IconButton
                      icon={<BiTrash />}
                      onClick={() => handleDeleteRoom(room)}
                      aria-label="Delete Room"
                    />
                  </Tooltip>
                </Box>
              ))
            ) : (
              <Text>No rooms available.</Text>
            )}
          </VStack>

          {/* Container 3 */}
          <VStack borderRight="2px solid gray" p="4">
            {container3.length ? (
              container3.map((room) => (
                <Box key={room.id} display="flex" justifyContent="space-between" alignItems="center" w="full">
                  <Button onClick={() => handleRoomSelect(room)}>{room.name}</Button>
                  <Tooltip label="Delete Room" aria-label="Delete Room Tooltip">
                    <IconButton
                      icon={<BiTrash />}
                      onClick={() => handleDeleteRoom(room)}
                      aria-label="Delete Room"
                    />
                  </Tooltip>
                </Box>
              ))
            ) : (
              <Text>No rooms available.</Text>
            )}
          </VStack>

          {/* Container 4 */}
          <VStack borderColor="gray.200"  p="4">
            {container4.length ? (
              container4.map((room) => (
                <Box key={room.id} display="flex" justifyContent="space-between" alignItems="center" w="full">
                  <Button onClick={() => handleRoomSelect(room)}>{room.name}</Button>
                  <Tooltip label="Delete Room" aria-label="Delete Room Tooltip">
                    <IconButton
                      icon={<BiTrash />}
                      onClick={() => handleDeleteRoom(room)}
                      aria-label="Delete Room"
                    />
                  </Tooltip>
                </Box>
              ))
            ) : (
              <Text>No rooms available.</Text>
            )}
          </VStack>
        </Grid>

        {/* Room Addition Form - Appears only when add button is clicked */}
        {isOpen && (
          <Stack direction="row" mt="4" p="4" boxShadow="md">
            <Input
              placeholder="Room Name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              />
              <Input
                placeholder="Room Password"
                type="password"
                value={newRoom.password}
                onChange={(e) =>
                  setNewRoom({ ...newRoom, password: e.target.value })
                }
              />
              <Button onClick={handleAddRoom}>Add Room</Button>
              <Button onClick={onClose}>Cancel</Button>
            </Stack>
          )}
        </VStack>
  
        {/* Password Modal for Room Access */}
        <Modal isOpen={isPasswordOpen} onClose={onPasswordClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Enter Password for {selectedRoom?.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Enter room password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              {/* Show error message if password is incorrect */}
              {errorMessage && <Text color="red.500" mt={3}>{errorMessage}</Text>}
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme="blue" onClick={handlePasswordSubmit}>
                Submit
              </Button>
              <Button onClick={onPasswordClose} ml={3}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
  
        {/* Password Modal for Room Deletion */}
        <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Verify Password to Delete {selectedRoom?.name}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Enter room password"
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
              {/* Show error message if password is incorrect */}
              {errorMessage && <Text color="red.500" mt={3}>{errorMessage}</Text>}
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme="red" onClick={handleDeleteSubmit}>
                Delete Room
              </Button>
              <Button onClick={onDeleteModalClose} ml={3}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  };
  
  export default RoomPage;
