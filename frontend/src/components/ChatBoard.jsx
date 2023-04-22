import { Box, Button, Flex, FormControl, Heading, Input, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import io from "socket.io-client";

const ENDPOINT = "https://chat-api-pearl.vercel.app/";
let socket ;
let selectedChatCompare;

function ChatBoard(props) {
  const { selectedChat, userDetail } = props;
  const [msg, setMsg] = useState("");
  const [allMsg,setAllMsg] = useState([])
  const [loading,setLoading] = useState(false);
  const [socketConnectivity, setsocketConnectivity] = useState(false)
  
  const handleSend = async() =>{
    try {
      let res = await axios.post(
        "https://chat-api-pearl.vercel.app/message/send",
        { msg, chatId: selectedChat._id },
        {
          headers: {
            "Content-type": "application/json",
            Authorization: userDetail.token,
          },
        }
      );
      setMsg("");
      socket.emit("new message",res.data)
      setAllMsg([...allMsg,res.data]);
    } catch (error) {
      console.log(error)
    }
  }

  const getMessages = async()=>{
    if(!selectedChat){
      return
    }else{
      setLoading(true);
      try {
        let res = await axios.get(
          `https://chat-api-pearl.vercel.app/message/receive/${selectedChat._id}`,
          {
            headers: {
              Authorization: userDetail.token,
            },
          }
        );
        setAllMsg(res.data);
        setLoading(false);
        socket.emit("join chat", selectedChat._id);
      } catch (error) {
        console.log(error);
      }
    }
  }

  const handleChange = (e)=>{
    let val = e.target.value;
    setMsg(val);
   }

  useEffect(() => {
    socket = io(ENDPOINT, {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "https://chat-api-pearl.vercel.app/",
      },
    });
    socket.emit("create", userDetail);
    socket.on("connection", () => setsocketConnectivity(true))
  }, []);

  

  useEffect(()=>{
    socket.on("message recieved", (newMessageRecieved) => {
       if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id){

       }else{
        setAllMsg([...allMsg, newMessageRecieved]);
       }
    });
  })

  useEffect(()=>{
    getMessages();
    selectedChatCompare = selectedChat
  },[selectedChat]);

  

  if (!selectedChat) {
    return (
      <Box align="center" mt="100px">
        <Heading>Start Chat...</Heading>
      </Box>
    );
  }


  return (
    <Box>
      <Box h="40px" bg={"white"}>
        <Heading>
          {selectedChat.isGroup
            ? selectedChat.groupName
            : selectedChat.users.filter((user) => user._id !== userDetail.id)[0]
                .name}
        </Heading>
      </Box>
      <Box h="76vh" overflowY={"scroll"}>
        {loading ? (
          <Spinner m="auto" align="center" size={"2xl"} />
        ) : (
          <Box>
            {allMsg?.map((m) => (
              <Box
                p={1}
                key={m._id}
                display={"flex"}
                justifyContent={
                  m.sender.name === userDetail.name ? "right" : "left"
                }
              >
                <Button
                  bg={
                    m.sender.name === userDetail.name ? "green.100" : "blue.100"
                  }
                >
                  {m.msg}
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Box>
      <FormControl isRequired>
        <Flex>
          <Input
            placeholder="Enter message..."
            onChange={handleChange}
            bg={"white"}
          />
          <Button onClick={handleSend}>send</Button>
        </Flex>
      </FormControl>
    </Box>
  );
}

export default ChatBoard