import React, { useEffect, useLayoutEffect } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Input, Icon, Avatar, Actionsheet, useDisclose, Button, Text, Box, NativeBaseProvider, HStack } from 'native-base'
import globalStyles from '../styles/global-styles'
/*FIREBASE */
import { onSnapshot, doc, getFirestore, addDoc, collection, query, orderBy, setDoc, where, getDocs, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth"
/*ICONS*/
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
/*COMPONENTS */
import ChatBox from './ChatBox';
import UserAvatar from './UserAvatar';
import { pickImage, takePhotoWithCamera, uploadPhotoToStorage } from '../services/UploadImages';

const Chat = ({ route, navigation }) => {
    const db = getFirestore()
    const auth = getAuth()
    const { friendName, friendId, actualUserUid, profilePhoto, actualUserPhoto, actualUserName } = route.params;
    const [messageInputValue, setMessageInputValue] = React.useState('')
    const [messages, setMessages] = React.useState([])
    const [messageCounter, setMessageCounter] = React.useState(0);
    const { isOpen, onOpen, onClose } = useDisclose();
    const id = actualUserUid > friendId ? `${actualUserUid + friendId}` : `${friendId + actualUserUid}`
    useEffect(() => {
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
        navigation.setOptions({
            title: friendName,
            headerLeft: () => <UserAvatar size='10' source={profilePhoto} marginRight={2} marginLeft={-5} />,
            headerBackVisible: true
        })
    }, [navigation])

    async function sendMessages() {
        setMessageInputValue('')
        if (messageInputValue !== '') {
            await addDoc(collection(db, 'chats', id, 'chat'), {
                sentBy: actualUserUid,
                recievedBy: friendId,
                message: messageInputValue,
                sentAt: {
                    date: new Date().toLocaleDateString('es', { year: '2-digit' }),
                    hour: new Date().toLocaleTimeString([], { hour12: true })
                }
            })

            await setDoc(doc(db, 'lastMessages', id), {
                sentTo: {
                    name: friendName,
                    uid: friendId,
                    photo: profilePhoto,
                    read: false
                },
                sentBy: {
                    uid: actualUserUid,
                    name: actualUserName,
                    photo: actualUserPhoto
                },
                id: [actualUserUid, friendId],
                message: {
                    text: messageInputValue,
                    dateSent: new Date().toLocaleDateString('es', { year: '2-digit' }),
                },
                
            })
        }
    }

    async function handleLibaryPhotosMessages() {
        onClose()
        let image = await pickImage()
        let imageFromStorage = await uploadPhotoToStorage(image, auth.currentUser.email)
        await addDoc(collection(db, 'chats', id, 'chat'), {
            sentBy: actualUserUid,
            recievedBy: friendId,
            message: imageFromStorage,
            sentAt: {
                date: new Date().toLocaleDateString('es', { year: '2-digit' }),
                hour: new Date().toLocaleTimeString([], { hour12: true })
            }
        })
        await setDoc(doc(db, 'lastMessages', id), {
            sentTo: {
                name: friendName,
                uid: friendId,
                photo: profilePhoto
            },
            sentBy: {
                uid: actualUserUid,
                name: actualUserName,
                photo: actualUserPhoto
            },
            id: [actualUserUid, friendId],
            message: {
                text: imageFromStorage,
                dateSent: new Date().toLocaleDateString('es', { year: '2-digit' }),
            }
        })
    }

    async function handleCameraPhotosMessage() {
        onClose()
        let photo = await takePhotoWithCamera()
        let imageFromStorage = await uploadPhotoToStorage(photo, auth.currentUser.email)
        await addDoc(collection(db, 'chats', id, 'chat'), {
            sentBy: actualUserUid,
            recievedBy: friendId,
            message: imageFromStorage,
            sentAt: {
                date: new Date().toLocaleDateString('es', { year: '2-digit' }),
                hour: new Date().toLocaleTimeString([], { hour12: true })
            }
        })
        await setDoc(doc(db, 'lastMessages', id), {
            sentTo: {
                name: friendName,
                uid: friendId,
                photo: profilePhoto
            },
            sentBy: {
                uid: actualUserUid,
                name: actualUserName,
                photo: actualUserPhoto
            },
            id: [actualUserUid, friendId],
            message: {
                text: imageFromStorage,
                dateSent: new Date().toLocaleDateString('es', { year: '2-digit' }),
            }
        })
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                renderItem={({ item }) =>
                    <ChatBox message={item.message} actualUserUid={actualUserUid} sentBy={item.sentBy} sentHour={item.sentAt.hour} />
                }
                keyExtractor={item => item.messageId}
            />
            <Box ml={2} mr={2} mt={2} mb={4} bg={'white'} borderRadius={'50'}>
                <Input
                    placeholder="Write a message..."
                    fontSize="14"
                    type='text'
                    variant={'rounded'}
                    _focus={{ borderColor: 'transparent' }}
                    value={messageInputValue}
                    onChangeText={text => setMessageInputValue(text)}
                    InputRightElement={
                        <>
                            <Icon
                                mr="3"
                                size="6"
                                color="muted.400"
                                onPress={onOpen}
                                as={<Entypo name="camera" />} />
                            <Icon
                                mr="3"
                                size="6"
                                color="muted.400"
                                onPress={() => sendMessages()}
                                as={<Ionicons name="send" />} />
                        </>
                    }
                />

            </Box>
            <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
                <Actionsheet.Content borderTopRadius="20">
                    <Actionsheet.Item
                        startIcon={<FontAwesome name="image" size={20} color="black" />}
                        borderRadius={'15'}
                        onPress={() => handleLibaryPhotosMessages()}>
                        Select an image
                    </Actionsheet.Item>
                    <Actionsheet.Item
                        startIcon={<Feather name="camera" size={20} color="black" />}
                        borderRadius={'15'}
                        onPress={() => handleCameraPhotosMessage()}>
                        Take a photo
                    </Actionsheet.Item>
                    <Actionsheet.Item
                        borderRadius={'15'}
                        _text={{ color: 'red.600' }}
                        _pressed={{ bg: 'red.100' }}
                        mb={1}
                        onPress={onClose}>
                        Cancel
                    </Actionsheet.Item>
                </Actionsheet.Content>
            </Actionsheet>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        flex: 1,
        backgroundColor: '#d1d5db'

    }

})

export default Chat
