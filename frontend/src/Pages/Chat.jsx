import {
  Box,
  Tab,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  FormLabel,
  FormControl,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ChatBoard from "../components/ChatBoard";


function Chat() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([])
  const [detail, setDetail] = useState({});
  const [groupName,setgroupName] = useState("");
  const [gMember,setGmember] = useState([]);
  const [selectedChat,setSelectedChat] = useState(false);
  const toast = useToast();

  const getAlluser = async (token) => {
    let res = await axios.get("https://chat-api-pearl.vercel.app/user", {
      headers: {
        Authorization: token,
      },
    });

    return res.data;
  };

  const getAllChats = async (token) => {
    let res = await axios.get("https://chat-api-pearl.vercel.app/chat/get", {
      headers: {
        Authorization: token,
      },
    });

    return res.data;
  };

  const handleSingleChat = (oppUserId) => {
     axios
       .post(
         "https://chat-api-pearl.vercel.app/chat/create/singlechat",
         { oppUserId },
         {
           headers: {
             "Content-type": "application/json",
             Authorization: detail.token,
           },
         }
       )
       .then((res) => {
         toast({
           description: res.data.msg,
           status: res.data.status,
           duration: 2000,
           position: "top-right",
           isClosable: true,
         });
       });
  };

  const handleGroupName = (e)=>{
    let gName = e.target.value;
    console.log(gName);
    setgroupName(gName);
  }

  const handleCollectUser = (id)=>{
    setGmember([...gMember,id])
    toast({
      description: `user added`,
      status: 'info',
      duration: 1000,
      position: "top-right",
      isClosable: true,
    });
  }

  const handleCreateGroup = async()=>{
     axios
       .post(
         "https://chat-api-pearl.vercel.app/chat/create/groupchat",
         { groupName, users: gMember },
         {
           headers: {
             "Content-type": "application/json",
             Authorization: detail.token,
           },
         }
       )
       .then((res) => {
         toast({
           description: res.data.msg,
           status: res.data.status,
           duration: 2000,
           position: "top-right",
           isClosable: true,
         });
       });
  }

  const SelectChat = (chat)=>{
     setSelectedChat(chat)
  }

  useEffect(() => {
    let userDetail = JSON.parse(localStorage.getItem("user")) || 0;
    if (userDetail) {
      setDetail(userDetail);
      getAlluser(userDetail.token).then((res) => setUsers(res));
      getAllChats(userDetail.token).then((res) => setChats(res));
    }
  }, [SelectChat]);

  return (
    <Box display={"flex"} justifyContent={"space-evenly"} mt="20px">
      <Box width="25%" h="90vh" border={'1px solid gray'}>
        <Tabs>
          <TabList>
            <Tab>My Chat</Tab>
            <Tab>All users</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {chats?.map((e) => (
                <Box
                  key={e._id}
                  borderRadius={10}
                  mt="4px"
                  h="30px"
                  onClick={() => SelectChat(e)}
                  bg={selectedChat === e ? "blue.200" : "gray.200"}
                >
                  <Text>
                    {e.isGroup
                      ? e.groupName
                      : e.users.filter((d) => d._id !== detail.id)[0].name}
                  </Text>
                </Box>
              ))}
            </TabPanel>
            <TabPanel>
              {users
                ?.filter((u) => u._id !== detail.id)
                .map((e) => (
                  <Box
                    key={e._id}
                    borderRadius={10}
                    bg={"gray.200"}
                    mt="4px"
                    h="30px"
                    onClick={() => handleSingleChat(e._id)}
                  >
                    <Text>{e.name}</Text>
                  </Box>
                ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Box>
          <Button onClick={onOpen} bg={"blue.200"}>
            Create Group
          </Button>
          <Modal
            isCentered
            onClose={onClose}
            isOpen={isOpen}
            motionPreset="slideInBottom"
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create Group</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl>
                  <FormLabel>Group name</FormLabel>
                  <Input onChange={handleGroupName} placeholder="Group name" />
                </FormControl>
                <Box>
                  {users
                    ?.filter((u) => u._id !== detail.id)
                    .map((e) => (
                      <Box
                        key={e._id}
                        bg={"gray.200"}
                        borderRadius={10}
                        mt="4px"
                        h="30px"
                        align='center'
                        onClick={() => handleCollectUser(e._id)}
                      >
                        <Text>{e.name}</Text>
                      </Box>
                    ))}
                </Box>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={handleCreateGroup}>
                  create
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Box>
      <Box w="70%" h="90vh" bgColor={"gray.200"} border={'1px solid gray'}>
        <ChatBoard selectedChat={selectedChat} userDetail={detail}/>
      </Box>
    </Box>
  );
}

export default Chat;
