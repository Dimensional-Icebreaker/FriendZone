import { Box, Button, Container, Flex, Text, useColorMode, useColorModeValue, IconButton } from "@chakra-ui/react";
import { IoMoon, IoArrowBack } from "react-icons/io5";  // Importing from react-icons
import { LuSun } from "react-icons/lu";  // Importing from react-icons
import CreateUserModal from "./CreateUserModal";

const Navbar = ({ room_id, setUsers }) => {
	const { colorMode, toggleColorMode } = useColorMode();

	const handleHomeClick = () => {
		// Navigate to the base URL or home page
		window.location.href = "/";
	};

	return (
		<Container maxW={"900px"}>
			<Box px={4} my={4} borderRadius={5} bg={useColorModeValue("gray.200", "gray.700")}>
				<Flex h='16' alignItems={"center"} justifyContent={"space-between"}>
					{/* Left side */}
					{/* Use IoArrowBack from react-icons */}
					<IconButton
							icon={<IoArrowBack />}  // Use the back arrow icon from react-icons
							aria-label="Back to Home"
							onClick={handleHomeClick}
							variant="solid"
						/>
					<Flex alignItems={"center"} justifyContent={"center"} gap={3} display={{ base: "none", sm: "flex" }}>
						<img src='/friends.png' alt='Friends logo' width={200} height={100} />
					</Flex>

					{/* Right side */}
					<Flex gap={3} alignItems={"center"}>
						<Text fontSize={"lg"} fontWeight={500} display={{ base: "none", md: "block" }}>
							🔥 Current Room ID: {room_id}
						</Text>
						
						<Button onClick={toggleColorMode}>
							{colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
						</Button>
						<CreateUserModal roomId={room_id} setUsers={setUsers} />
					</Flex>
				</Flex>
			</Box>
		</Container>
	);
};

export default Navbar;
