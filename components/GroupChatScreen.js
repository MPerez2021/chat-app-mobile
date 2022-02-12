
import React, { useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
/*NATIVE BASE */
import { Input, Icon, Avatar, FlatList, Actionsheet, useDisclose, Button, Text, Box, NativeBaseProvider, HStack } from 'native-base'
/*ICONS*/
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
/*FIREBASE */
import { onSnapshot, getFirestore, collection, query, addDoc, orderBy } from "firebase/firestore"
import { getAuth } from 'firebase/auth';

import globalStyles from '../styles/global-styles';
import ChatBox from './ChatBox';
/*SERVICES */
import { pickImage, takePhotoWithCamera, uploadPhotoToStorage } from '../services/UploadImages';
import UserAvatar from './UserAvatar';

const GroupChatScreen = ({ route, navigation }) => {
    const db = getFirestore()
    const auth = getAuth()
    const [messages, setMessages] = React.useState([])
    const [messageInputValue, setMessageInputValue] = React.useState('')
    const { isOpen, onOpen, onClose } = useDisclose();
    const { id, groupName, createdBy, isGroupChat, groupImage } = route.params;
    const actualUserId = auth.currentUser.uid
    const currentUserName = auth.currentUser.displayName
    const userPhotoProfile = auth.currentUser.photoURL
    useEffect(() => {
        const groupRef = query(collection(db, 'groupChats', id, 'messages'), orderBy('sentAt.date', 'asc'), orderBy('sentAt.hour', 'asc'))
        const unsubcribe = onSnapshot(groupRef, querySnapshot => {
            let msgs = []
            querySnapshot.forEach(data => {
                let msg = {
                    messageId: data.id,
                    message: data.data().message,
                    sentBy: {
                        uid: data.data().sentBy.uid,
                        profilePhoto: data.data().sentBy.profilePhoto,
                        userName: data.data().sentBy.userName
                    },
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
            title: groupName,
            headerLeft: () => <UserAvatar size='10' source={groupImage} marginRight={2} marginLeft={-5} />,
            headerBackVisible: true
        })
    }, [navigation])


    async function sendMessages() {
        setMessageInputValue('')
        if (messageInputValue !== '') {
            await addDoc(collection(db, 'groupChats', id, 'messages'), {
                sentBy: {
                    uid: actualUserId,
                    profilePhoto: userPhotoProfile,
                    userName: currentUserName
                },
                message: messageInputValue,
                sentAt: {
                    date: new Date().toLocaleDateString('es', { year: '2-digit' }),
                    hour: new Date().toLocaleTimeString([], { hour12: true })
                }
            })
            /*  await setDoc(doc(db, 'lastGroupMessages', id), {
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
 
             }) */
        }
    }

    async function handleLibaryPhotosMessages() {
        onClose()
        let image = await pickImage()
        if (image) {
            let imageFromStorage = ''
            imageFromStorage = await uploadPhotoToStorage('groupChat', image, id, 'sentPhotos')
            await addDoc(collection(db, 'groupChats', id, 'messages'), {
                sentBy: {
                    uid: actualUserId,
                    profilePhoto: userPhotoProfile,
                    userName: currentUserName
                },
                message: imageFromStorage,
                sentAt: {
                    date: new Date().toLocaleDateString('es', { year: '2-digit' }),
                    hour: new Date().toLocaleTimeString([], { hour12: true })
                }
            })
        }

    }

    async function handleCameraPhotosMessage() {
        onClose()
        let photo = await takePhotoWithCamera()
        if (photo) {
            let imageFromStorage = ''
            imageFromStorage = await uploadPhotoToStorage('groupChat', photo, id, 'sentPhotos')
            await addDoc(collection(db, 'groupChats', id, 'messages'), {
                sentBy: {
                    uid: actualUserId,
                    profilePhoto: userPhotoProfile,
                    userName: currentUserName
                },
                message: imageFromStorage,
                sentAt: {
                    date: new Date().toLocaleDateString('es', { year: '2-digit' }),
                    hour: new Date().toLocaleTimeString([], { hour12: true })
                }
            })
        }

    }
    return (
        <View style={styles.container}>
            {messages.length ? <FlatList
                data={messages}
                renderItem={({ item }) =>
                    <ChatBox message={item.message}
                        actualUserUid={actualUserId}
                        sentBy={item.sentBy.uid}
                        sentHour={item.sentAt.hour}
                        isGroupChat={isGroupChat}
                        userPhoto={item.sentBy.profilePhoto}
                        userName={item.sentBy.userName} />
                }
                keyExtractor={item => item.messageId}
            /> : <Box mt={3} maxWidth={200} alignSelf={'center'} borderRadius={'5'} bg={'muted.100'}>
                {createdBy === currentUserName
                    ? <Text p={2} textAlign={'center'}> Has creado el grupo {groupName}.</Text>
                    : <Text p={2} textAlign={'center'}> {createdBy} Te ha añadio al grupo {groupName}.</Text>}
            </Box>
            }
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
    );
};

const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        flex: 1,
        backgroundColor: '#d1d5db',
        justifyContent: 'space-between'
    }

})
export default GroupChatScreen;

