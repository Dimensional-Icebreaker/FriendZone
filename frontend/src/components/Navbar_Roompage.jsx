import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import CreateRoomModal from "./CreateRoomModal"; // Import the CreateRoomModal component

const Navbar_Roompage = ({ setRooms }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Container maxW={"900px"}>
      <Box px={4} my={4} borderRadius={5} bg={useColorModeValue("gray.200", "gray.700")}>
        <Flex h='16' alignItems={"center"} justifyContent={"space-between"}>
          {/* Left side */}
          <Flex alignItems={"center"} justifyContent={"center"} gap={3} display={{ base: "none", sm: "flex" }}>
            <Text fontSize={"40px"}> </Text>
            <img src='/friends.png' alt='Friends logo' width={200} height={100} />
          </Flex>

          {/* Right side */}
          <Flex gap={3} alignItems={"center"}>
            <Text fontSize={"lg"} fontWeight={500} display={{ base: "none", md: "block" }}>
              🔥
            </Text>

            {/* Toggle color mode */}
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
            </Button>

            {/* Add Room Button - triggers CreateRoomModal */}
            <CreateRoomModal setRooms={setRooms} />
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};

export default Navbar_Roompage;
