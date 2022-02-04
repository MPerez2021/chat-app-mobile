import React, { useEffect, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableHighlight, ScrollView } from 'react-native';
import globalStyles from '../../../styles/global-styles';
/*NATIVE BASE */
import { Text, Box, VStack, Stack, Badge, Divider, Icon, Button, Input } from 'native-base'
/*ICONS */
import { Entypo } from '@expo/vector-icons';
/*FIREBASE */
import { collection, query, getFirestore, onSnapshot, setDoc, doc, getDoc, addDoc, where } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import GroupChat from '../../../components/SelectChat/GroupChat';
import OneToOneChat from '../../../components/SelectChat/OneToOneChat';

const AllUsers = ({ route, navigation }) => {
    const db = getFirestore()
    const auth = getAuth()
    const [users, setUsers] = React.useState([])
    const [userNewGroupChat, setUsersNewGroupChat] = React.useState([])
    const [groupName, setGroupName] = React.useState('')
    const { newGroup, newChat } = route.params;
    useEffect(() => {
        const getAllUsers = query(collection(db, 'users'), where('email', '!=', auth.currentUser.email))
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

    async function createNewGroup() {

        //userNewGroupChat.push(users)
        //console.log(userNewGroupChat);
        /* let x = crypto.getRandomValues
        console.log(x); */
        await addDoc(collection(db, 'groupChats', '123', 'chats'), {
            message: 'Hola como estas'

        })
        let hola = userNewGroupChat
        hola.push(auth.currentUser.uid)
        await addDoc(collection(db, 'groupIdUsers'), {
            name: groupName,
            foto: '',
            id: '123',
            users: hola
        })

        navigation.navigate('GroupChatScreen', {
            id: '123',
            name: groupName
        })
        hola = []
        setUsersNewGroupChat([])
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
                                onPress={() => console.log(groupName)}
                                as={<Entypo name="camera" />} />
                        } />
                    : null}
                {users.map(user =>
                    <View key={user.id}>
                        {newChat ? <OneToOneChat user={user} navigation={navigation} /> :
                            <GroupChat userId={user.id}
                                userNewGroupChat={userNewGroupChat}
                                name={user.name}
                                email={user.email}
                                photo={user.photo} />}
                    </View>
                )}
                {newGroup ? <Button onPress={() => createNewGroup()}>CREAR</Button> : null}
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
