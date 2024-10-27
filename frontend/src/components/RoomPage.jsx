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
  IconButton,
  Tooltip,
  Divider,
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
  const [errorMessage, setErrorMessage] = useState('');

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
    setSelectedRoom(room);
    setErrorMessage('');
    onPasswordOpen();
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
        onRoomSelect(selectedRoom.id);
        onPasswordClose();
      } else {
        setErrorMessage(result.error || "Incorrect password!");
      }
    } catch (error) {
      setErrorMessage('Error verifying password. Please try again.');
      console.error('Error verifying password:', error);
    }
  };

  // Handle delete room with password verification
  const handleDeleteRoom = async (room) => {
    setSelectedRoom(room);
    onDeleteModalOpen();
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
        await fetch(`/api/rooms/${selectedRoom.id}/delete`, {
          method: 'DELETE',
        });
        setRooms(rooms.filter((room) => room.id !== selectedRoom.id));
        onDeleteModalClose();
      } else {
        setErrorMessage(result.error || "Incorrect password!");
      }
    } catch (error) {
      setErrorMessage('Error verifying password. Please try again.');
      console.error('Error verifying password:', error);
    }
  };

  return (
    <>
      <Navbar_Roompage setRooms={setRooms} />
      <Container maxW="md" my={4} centerContent>
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

        <VStack align="center" w="full" spacing={4}>
          {rooms.length ? (
            rooms.map((room) => (
              <VStack key={room.id} w="full" maxW="md" spacing={3}>
                <Box display="flex" justifyContent="space-between" alignItems="center" w="full">
                  <Button onClick={() => handleRoomSelect(room)}>{room.name}</Button>
                  <Tooltip label="Delete Room" aria-label="Delete Room Tooltip">
                    <IconButton
                      icon={<BiTrash />}
                      onClick={() => handleDeleteRoom(room)}
                      aria-label="Delete Room"
                    />
                  </Tooltip>
                </Box>
                <Divider /> {/* Add Divider as line separator */}
              </VStack>
            ))
          ) : (
            <Text>No rooms available.</Text>
          )}

          {/* Room Addition Form */}
          {isOpen && (
            <Stack direction="row" mt="4" p="4" boxShadow="md" w="full" maxW="md">
              <Input
                placeholder="Room Name"
                value={newRoom.name}
                onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              />
              <Input
                placeholder="Room Password"
                type="password"
                value={newRoom.password}
                onChange={(e) => setNewRoom({ ...newRoom, password: e.target.value })}
              />
              <Button onClick={handleAddRoom}>Add Room</Button>
              <Button onClick={onClose}>Cancel</Button>
            </Stack>
          )}
        </VStack>
      </Container>

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
            {errorMessage && <Text color="red.500" mt={3}>{errorMessage}</Text>}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handlePasswordSubmit}>Submit</Button>
            <Button onClick={onPasswordClose} ml={3}>Cancel</Button>
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
            {errorMessage && <Text color="red.500" mt={3}>{errorMessage}</Text>}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={handleDeleteSubmit}>Delete Room</Button>
            <Button onClick={onDeleteModalClose} ml={3}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RoomPage;
