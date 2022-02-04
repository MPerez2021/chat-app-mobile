import React from 'react';
import { Stack, View, Box, Icon, VStack, Text, Divider } from 'native-base';
import { TouchableHighlight } from 'react-native';
import UserAvatar from '../UserAvatar';
import { AntDesign } from '@expo/vector-icons';
const GroupChat = ({ userId, userNewGroupChat, photo, name, email }) => {
    function addUserToGroup(userId) {     
        userNewGroupChat.push(userId)
    }
    return <View>
        <TouchableHighlight onPress={() => addUserToGroup(userId)}>
            <View>
                <Stack bg="white" direction={'row'} padding={4}>
                    <Stack alignSelf={'center'} width={'15%'} mr={1}>
                        <Box position={'relative'}>
                            <UserAvatar size='md' source={photo} />
                        </Box>
                        <Icon
                            size="5"
                            position={'absolute'}
                            bottom={0}
                            right={1}
                            color={'white'}
                            backgroundColor={'green.600'}
                            borderRadius={50}
                            as={<AntDesign name="checkcircleo" />} />
                    </Stack>
                    <VStack width={'85%'}>
                        <Text fontSize="lg">{name}</Text>
                        <Text fontSize="md">{email}</Text>
                    </VStack>
                </Stack>
                <Divider />
            </View>
        </TouchableHighlight>
    </View>
};

export default GroupChat;


