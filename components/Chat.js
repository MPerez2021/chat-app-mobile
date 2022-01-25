import React, { useEffect, useLayoutEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Input, Icon, Avatar } from 'native-base'
import globalStyles from '../styles/global-styles'
/*FIREBASE */
import { onSnapshot, doc, getFirestore, addDoc, collection, query, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth"
/*ICONS*/
import { Ionicons } from '@expo/vector-icons';
import ChatBox from './ChatBox';
import UserAvatar from './UserAvatar';

const Chat = ({ route, navigation }) => {
    const db = getFirestore()
    const auth = getAuth()
    const { friendName, friendId, actualUserUid, profilePhoto } = route.params;
    const [messageInputValue, setMessageInputValue] = React.useState('')
    const [messages, setMessages] = React.useState([])
    useEffect(() => {
        const id = actualUserUid > friendId ? `${actualUserUid + friendId}` : `${friendId + actualUserUid}`
        const chatRef = query(collection(db, 'chats', id, 'chat'), orderBy('sentAt.date', 'asc'), orderBy('sentAt.hour', 'asc'))
        const unsubcribe = onSnapshot(chatRef, querySnapshot => {
            let msgs = []
            querySnapshot.forEach(data => {
                let msg = {
                    messageId: data.id,
                    message: data.data().message,
                    recievedBy: data.data().recievedBy,
                    sentBy: data.data().sentBy,
                    sentAt: {
                        date: data.data().sentAt.date,
                        hour: data.data().sentAt.hour.replace(/(.*)\D\d+/, '$1')
                    }
                }
                msgs.push(msg)
            })
            setMessages(msgs)
        })
        return () => {
            unsubcribe()
        };
    }, []);

    useLayoutEffect(() => {
        const url = 'https://dam.ngenespanol.com/wp-content/uploads/2019/10/perros-personalidad-2.jpg'
        navigation.setOptions({
            title: friendName,
            headerLeft: () => <UserAvatar size='10' source={profilePhoto} marginRight={2} marginLeft={-5} />,
            headerBackVisible: true            
        })
    }, [navigation])

    async function sendMessages() {
        setMessageInputValue('')
        const id = actualUserUid > friendId ? `${actualUserUid + friendId}` : `${friendId + actualUserUid}`
        await addDoc(collection(db, 'chats', id, 'chat'), {
            sentBy: actualUserUid,
            recievedBy: friendId,
            message: messageInputValue,
            sentAt: {
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
                    <ChatBox message={item.message} actualUserUid={actualUserUid} sentBy={item.sentBy} sendtHour={item.sentAt.hour} />
                }
                keyExtractor={item => item.messageId}
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
                value={messageInputValue}
                onChangeText={text => setMessageInputValue(text)}
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
        backgroundColor: 'grey'
    }

})
export default Chat
