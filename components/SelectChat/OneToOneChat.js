import React from 'react';
import { View, TouchableHighlight } from 'react-native';
import { Text, Box, VStack, Stack, Badge, Divider, Icon, Button, Input } from 'native-base'
import { getAuth } from 'firebase/auth';
import UserAvatar from '../UserAvatar';
const OneToOneChat = ({ navigation, user }) => {
    const auth = getAuth()
    function createNewChat(friendId, name, friendPhoto) {
        const user = auth.currentUser
        navigation.navigate('Chat', {
            friendId: friendId,
            friendName: name,
            actualUserUid: user.uid,
            actualUserPhoto: user.photoURL,
            actualUserName: user.displayName,
            profilePhoto: friendPhoto     
        })
    }
    return (
        <TouchableHighlight onPress={() => createNewChat(user.id, user.name, user.photo)}>
            <View>
                <Stack bg="white" direction={'row'} padding={4}>
                    <Stack alignItems={'center'} width={'15%'}>
                        <UserAvatar size='md' source={user.photo} marginRight={3} />
                    </Stack>
                    <VStack width={'85%'}>
                        <Text fontSize="lg">{user.name}</Text>
                        <Text fontSize="md">{user.email}</Text>
                    </VStack>
                </Stack>
                <Divider />
            </View>
        </TouchableHighlight>

    );
};

export default OneToOneChat;


