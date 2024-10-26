import {
    Button,
    Flex,
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
    Radio,
    RadioGroup,
    Textarea,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { BASE_URL } from "../App";

const CreateUserModal = ({ roomId, setUsers }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const [inputs, setInputs] = useState({
        name: "",
        role: "",
        description: "",
        gender: "",
    });
    const toast = useToast();

    const handleCreateUser = async (e) => {
        e.preventDefault(); // prevent page refresh
        setIsLoading(true);

        // Ensure roomId is available
        if (!roomId) { 
            toast({
                status: "error",
                title: "Room ID is missing!",
                description: "Cannot add a friend without a valid room ID.",
                duration: 3000,
            });
            setIsLoading(false);
            return;
        }

		try {
			// Make API request with roomId
			const res = await fetch(`${BASE_URL}/api/rooms/${roomId}/friends`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(inputs),
			});

			const data = await res.json();
			if (!res.ok) {
			throw new Error(data.error);
			}

			toast({
			status: "success",
			title: "Friend created successfully!",
			duration: 2000,
			});
			
			// Check if setUsers is a function before calling it
			setUsers((prevUsers) => [...prevUsers, data]);
			onClose();
			

			// Reset inputs
			setInputs({
				name: "",
				role: "",
				description: "",
				gender: "",
			});

		} catch (error) {
			console.error('An error occurred:', error); // Log the full error
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
                <BiAddToQueue size={20} />
            </Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <form onSubmit={handleCreateUser}>
                    <ModalContent>
                        <ModalHeader>New Pal to the Zone</ModalHeader>
                        <ModalCloseButton />

                        <ModalBody pb={6}>
                            <Flex alignItems={"center"} gap={4}>
                                <FormControl>
                                    <FormLabel>Full Name</FormLabel>
                                    <Input
                                        placeholder='Enter name'
                                        value={inputs.name}
                                        onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Role</FormLabel>
                                    <Input
                                        placeholder='Enter role'
                                        value={inputs.role}
                                        onChange={(e) => setInputs({ ...inputs, role: e.target.value })}
                                    />
                                </FormControl>
                            </Flex>

                            <FormControl mt={4}>
                                <FormLabel>Description</FormLabel>
                                <Textarea
                                    placeholder='Describe your friend'
                                    value={inputs.description}
                                    onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
                                />
                            </FormControl>

                            <RadioGroup mt={4}>
                                <Flex gap={5}>
                                    <Radio
                                        value='male'
                                        onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
                                    >
                                        Male
                                    </Radio>
                                    <Radio
                                        value='female'
                                        onChange={(e) => setInputs({ ...inputs, gender: e.target.value })}
                                    >
                                        Female
                                    </Radio>
                                </Flex>
                            </RadioGroup>
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} type='submit' isLoading={isLoading}>
                                Add
                            </Button>
                            <Button onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    );
};

export default CreateUserModal; 
