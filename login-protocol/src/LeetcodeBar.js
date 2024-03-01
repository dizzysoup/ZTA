import { useEffect, useState } from "react";
import { Progress, Button, Box, Heading, Text , Stack ,Flex, useAccordionItemState } from "@chakra-ui/react";

function PointsBlock(keys){
  const point = keys.item.points;
  return (
    <Flex
      position="relative"
      backgroundColor="gray.300"
      w="850px"
      h="auto"
      p="2%"
      justify="center"
      alignItems="center" // 让子元素垂直居中
    >
      <Text fontSize="lg">{keys.item.user.username}</Text>
      <Progress ml="2%" value={point} max={100} w="450px" />
      <Text ml="2%" fontSize={20} align="left">
        {point} / 100
      </Text>
      <Box
        position="absolute"
        bottom={0}
        right={830}
        width={0}
        height={0}
        borderStyle="solid"
        borderWidth="0 20px 20px 0"
        borderColor="transparent transparent orange transparent"
      />
    </Flex>
  );
}

function LeetcodeBar() {
  const [UserData , setUserData] = useState([]); // Set initial user data to an empty array [

  useEffect(() => {
    const sourceurl = "https://source.ztaenv.duckdns.org/leetcodebar/score/"
    fetch(sourceurl)
      .then((res) => res.json())
      .then((data) => {
        setUserData(data["Scores"]);
      });
  }, []);
  console.log(UserData)
  return (
    <Box  backgroundColor={"gray.400"}  align={"center"} width = "100vw" h="100vh"  pt = "4%">
      <Heading mb={4}>Leetcode 進度表</Heading>      
        <Box align="left" ml = "5%">
        <Stack width="100%" h="100%" align={"center"} spacing={2} alignContent={"center"}>
          { Array.isArray(UserData) && UserData.length > 0 ?  UserData.map((item , index) => (
            <PointsBlock key = {index} item={item}/>
          )) : <Text> Loading... </Text> }            
        </Stack>
        </Box>
      <Heading mt={"5%"}> 本賽季題目挑戰 </Heading>
    </Box>
  );
}

export default LeetcodeBar;