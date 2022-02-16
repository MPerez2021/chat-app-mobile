import React, { useEffect, useLayoutEffect} from 'react';
import { Stack, View, Box, Icon, VStack, Text, Divider } from 'native-base';
import { FlatList, TouchableHighlight } from 'react-native';
import UserAvatar from '../UserAvatar';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
const GroupChat = ({ userId, userNewGroupChat, photo, name, email }) => {
    const [userAdded, setUserAdded] = React.useState(false)
    /*  useFocusEffect(
         React.useCallback(() => {
             setUserAdded(false)
         }, [])
     ) */

     useLayoutEffect(() => {
        setUserAdded(false)
    }, [])
    function addUserToGroup(userId) {
        if (userNewGroupChat.indexOf(userId) === -1) {
            userNewGroupChat.push(userId)
            setUserAdded(true)
            console.log('creado ' + userId + userAdded);
        } else {
            /*Busco el index donde se encuentra el id, y elimino el id de la
            posición en que se encuentra*/
            let index = userNewGroupChat.indexOf(userId, 0)
            userNewGroupChat.splice(index, 1)
            setUserAdded(false)
            console.log('borrado ' + userId + userAdded);
        }

    }
    return <View>
        <TouchableHighlight onPress={() => addUserToGroup(userId)}>
            <>
                <Stack bg="white" direction={'row'} padding={4}>
                    <Stack alignSelf={'center'} width={'15%'} mr={1}>
                        <Box position={'relative'}>
                            <UserAvatar size='md' source={photo} />
                        </Box>
                        {userAdded ? <Icon
                            size="5"
                            position={'absolute'}
                            bottom={0}
                            right={1}
                            color={'white'}
                            backgroundColor={'green.600'}
                            borderRadius={50}
                            as={<AntDesign name="checkcircleo" />} /> : null}

                    </Stack>
                    <VStack width={'85%'}>
                        <Text fontSize="lg">{name}</Text>
                        <Text fontSize="md">{email}</Text>
                    </VStack>
                </Stack>
                <Divider />
            </>
        </TouchableHighlight>
    </View>
};

export default GroupChat;


