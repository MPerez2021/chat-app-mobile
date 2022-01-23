import React, { useEffect, useLayoutEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { HStack, Input, Icon, StatusBar, Box, Pressable, Center, Stack, Text } from 'native-base'
import globalStyles from '../styles/global-styles'
/*FIREBASE */
import { onSnapshot, doc, getFirestore, addDoc, collection, query, orderBy, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"
/*ICONS*/
import { Ionicons } from '@expo/vector-icons';
import ChatBox from './ChatBox';

const Chat = ({ route, navigation }) => {
    const db = getFirestore()
    const auth = getAuth()
    const { friendName, friendId, actualUserUid } = route.params;
    const [message, setMessage] = React.useState('')
    const [messages, setMessages] = React.useState([])
    useEffect(() => {
        let unsubcribe = getMessages()
        return () => {
            unsubcribe
        };
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: friendName
        })
    }, [navigation])


    const getMessages = () => {
        const id = actualUserUid > friendId ? `${actualUserUid + friendId}` : `${friendId + actualUserUid}`
        const q = query(collection(db, 'chats', id, 'chat'), orderBy('sendAt.date', 'asc'), orderBy('sendAt.hour', 'asc'))
        onSnapshot(q, querySnapshot => {
            let msgs = []
            querySnapshot.forEach(data => {
                msgs.push(data.data())
            })
            setMessages(msgs)
        })
        console.log(messages);

    }
    async function sendMessages() {
        const id = actualUserUid > friendId ? `${actualUserUid + friendId}` : `${friendId + actualUserUid}`
        await addDoc(collection(db, 'chats', id, 'chat'), {
            sendBy: actualUserUid,
            recievedBy: friendId,
            message: message,
            sendAt: {
                date: new Date().toLocaleDateString('es', { year: '2-digit' }),
                hour: new Date().toLocaleTimeString([], { hour12: true })
            }
        })
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) =>
                    <ChatBox message={item.message} actualUserUid={actualUserUid} sendBy={item.sendBy} hourSend={item.sendAt.hour} />
                }
            //keyExtractor={item => item.sendBy}
            />
            <Input
                placeholder="Write a message..."
                width="90%"
                p={3}
                m={5}
                fontSize="14"
                type='text'
                /*  bg={'muted.50'} */
                variant={'rounded'}
                _focus={{ borderColor: '#fff' }}
                value={message}
                onChangeText={text => setMessage(text)}
                InputRightElement={
                    <Icon
                        mr="3"
                        size="6"
                        width={'10%'}
                        color="muted.400"
                        onPress={() => sendMessages()}
                        as={<Ionicons name="send" />}
                    />
                }
            />


        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-end'
    }

})
export default Chat
