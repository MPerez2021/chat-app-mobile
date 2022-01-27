import React, { useEffect, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableHighlight, ScrollView } from 'react-native';
import globalStyles from '../../../styles/global-styles';
/*NATIVE BASE */
import { Text, Box, VStack, Stack, Badge, Divider, Icon, HStack, Input } from 'native-base'

/*ICONS */
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
/*FIREBASE */
import { collection, query, getFirestore, onSnapshot, setDoc, doc, getDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import UserAvatar from '../../../components/UserAvatar';

const AllUsers = ({ route, navigation }) => {
    const db = getFirestore()
    const auth = getAuth()
    const [users, setUsers] = React.useState([])
    const [userNewGroupChat, setUsersNewGroupChat] = React.useState([])
    const [groupName, setGroupName] = React.useState('')
    const { newGroup, newChat } = route.params;
    useEffect(() => {
        const getAllUsers = query(collection(db, 'users'))
        const unsubscribe = onSnapshot(getAllUsers, (data) => {
            let user = []
            data.forEach(userData => {
                let docs = {
                    name: userData.data().name,
                    email: userData.data().email,
                    photo: userData.data().profilePhoto,
                    id: userData.id
                }
                user.push(docs)
            })
            setUsers(user)
        })
        return () => {
            unsubscribe();
        };
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: newGroup ? newGroup : newChat
        })
    }, [navigation])

    async function createNewChat(friendId, name) {
        const user = auth.currentUser
        navigation.navigate('Chat', {
            friendId: friendId,
            friendName: name,
            actualUserUid: user.uid,
            profilePhoto: user.photoURL
        })
    }

    function createNewGroup(users) {
        setUsersNewGroupChat([])
        //userNewGroupChat.push(users)   
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                {newGroup ?
                    <Input
                        placeholder="Write a title"
                        fontSize="14"
                        type='text'
                        variant={'rounded'}
                        _focus={{ borderColor: 'transparent' }}
                        value={groupName}
                        onChangeText={text => setGroupName(text)}
                        InputRightElement={
                            <Icon
                                mr="3"
                                size="6"
                                color="muted.400"
                                onPress={()=> console.log(groupName)}
                                as={<Entypo name="camera" />} />


                        } />
                    : null}
                {users.map(user =>
                    <View key={user.id}>
                        {user.id !== auth.currentUser.uid ?
                            <View>
                                {newChat ? <TouchableHighlight onPress={() => createNewChat(user.id, user.name)}>
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
                                </TouchableHighlight> :
                                    <TouchableHighlight onPress={() => createNewGroup(user)}>
                                        <View>
                                            <Stack bg="white" direction={'row'} padding={4}>
                                                <Stack alignSelf={'center'} width={'15%'} mr={1}>
                                                    <Box position={'relative'}>
                                                        <UserAvatar size='md' source={user.photo} />
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
                                                    <Text fontSize="lg">{user.name}</Text>
                                                    <Text fontSize="md">{user.email}</Text>
                                                </VStack>
                                            </Stack>
                                            <Divider />
                                        </View>
                                    </TouchableHighlight>}
                            </View> : null}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        flex: 1
    }

})
export default AllUsers;
