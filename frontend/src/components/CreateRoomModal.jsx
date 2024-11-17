import { 
    Button,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiAddToQueue } from "react-icons/bi";

const CreateRoomModal = ({ setRooms }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [roomInputs, setRoomInputs] = useState({
        name: "",
        access_password: "",
        admin_password: "",
        email: "", // Added email state
    });
    const toast = useToast();

    // Handle room creation
    const handleCreateRoom = async (e) => {
        e.preventDefault(); // Prevent page refresh

        // Validate email before making API call
        if (!roomInputs.email) {
            toast({
                status: "error",
                title: "Email Required",
                description: "Please provide a valid email address.",
                duration: 3000,
                position: "top-center",
            });
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch("/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(roomInputs),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error);
            }

            toast({
                status: "success",
                title: "Room Created 🎉",
                description: "Room created successfully.",
                duration: 2000,
                position: "top-center",
            });
            onClose();
            setRooms((prevRooms) => [...prevRooms, data]);

            // Clear inputs after success
            setRoomInputs({
                name: "",
                access_password: "",
                admin_password: "",
                email: "",
            });
        } catch (error) {
            toast({
                status: "error",
                title: "An error occurred.",
                description: error.message,
                duration: 4000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button onClick={onOpen}>
                <BiAddToQueue size={20} /> Add Room
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <form onSubmit={handleCreateRoom}>
                    <ModalContent>
                        <ModalHeader> Create a New Room </ModalHeader>
                        <ModalCloseButton />

                        <ModalBody pb={6}>
                            <FormControl isRequired>
                                <FormLabel>Room Name</FormLabel>
                                <Input
                                    placeholder="Enter room name"
                                    value={roomInputs.name}
                                    onChange={(e) => setRoomInputs({ ...roomInputs, name: e.target.value })}
                                />
                            </FormControl>

                            <FormControl isRequired mt={4}>
                                <FormLabel>Access Password</FormLabel>
                                <Input
                                    placeholder="Enter room access password"
                                    type="password"
                                    value={roomInputs.access_password}
                                    onChange={(e) => setRoomInputs({ ...roomInputs, access_password: e.target.value })}
                                />
                            </FormControl>
                            <FormControl isRequired mt={4}>
                                <FormLabel> Email</FormLabel>
                                <Input
                                    placeholder="Enter email"
                                    type="email"
                                    value={roomInputs.email}
                                    onChange={(e) => setRoomInputs({ ...roomInputs, email: e.target.value })}
                                    required // This makes the email input mandatory
                                />
                            </FormControl>
                            <FormControl isRequired mt={4}>
                                <FormLabel>Admin Password</FormLabel>
                                <Input
                                    placeholder="Enter admin password"
                                    type="password"
                                    value={roomInputs.admin_password}
                                    onChange={(e) => setRoomInputs({ ...roomInputs, admin_password: e.target.value })}
                                />
                            </FormControl>

                            
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} type="submit" isLoading={isLoading}>
                                Create Room
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    );
};

export default CreateRoomModal;
