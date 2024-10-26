import React, { useState, useEffect } from 'react';
import { Container, Stack, Text } from "@chakra-ui/react";
import UserGrid from './UserGrid';
import Navbar from './Navbar';

const Zone = ({ room_id }) => {
    const [friends, setFriends] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFriendsData = async () => {
            try {
                const response = await fetch(`/api/rooms/${room_id}/friends`);
                if (!response.ok) {
                    throw new Error('Failed to fetch friends data');
                }
                const data = await response.json();
                setFriends(data || []);
            } catch (err) {
                setError('Error fetching friends data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchFriendsData();
    }, [room_id]);

    if (error) {
        return <Text textAlign="center" mt={4}>{error}</Text>;
    }

    return (
        <Stack minH={"100vh"}>
            <Navbar room_id={room_id} setUsers={setFriends} />
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
                        ZONE 
                    </Text>
                </Text>
                <UserGrid users={friends} setUsers={setFriends} isLoading={isLoading} room_id={room_id} />
            </Container>
        </Stack>
    );
};

export default Zone;
