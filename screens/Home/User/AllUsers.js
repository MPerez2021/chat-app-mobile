import React, { useEffect, useLayoutEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableHighlight, ScrollView, Image, ToastAndroid } from 'react-native';
import globalStyles from '../../../styles/global-styles';
/*NATIVE BASE */
import { Avatar, Icon, IconButton, Input, Text, useDisclose, Actionsheet, HStack, Box, useToast, Stack } from 'native-base'
/*ICONS*/
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
/*FIREBASE */
import { collection, query, getFirestore, onSnapshot, setDoc, doc, getDoc, addDoc, where } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
/*COMPONENTS */
import GroupChat from '../../../components/SelectedChatScreen/GroupChat';
import OneToOneChat from '../../../components/SelectedChatScreen/OneToOneChat';
import { pickImage, takePhotoWithCamera, uploadPhotoToStorage } from '../../../services/UploadImages';
import uuid from 'react-native-uuid'
const AllUsers = ({ route, navigation }) => {
    const db = getFirestore();
    const auth = getAuth();
    const [users, setUsers] = React.useState([])
    const [userNewGroupChat, setUsersNewGroupChat] = React.useState([])
    const [groupName, setGroupName] = React.useState('')
    const [groupImage, setGroupImage] = React.useState(null)
    const { isOpen, onOpen, onClose } = useDisclose();
    const { newGroup, newChat } = route.params;
    const cameraIcon = 'https://img2.freepng.es/20180409/jiq/kisspng-camera-computer-icons-photography-clip-art-camera-icon-5acb0a3cc83729.6571769815232558688201.jpg'
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
        const id = uuid.v4();
        const actualUserId = auth.currentUser.uid
        let actualUserName = auth.currentUser.displayName
        let groupPhoto = await uploadPhotoAndGetUrl(id)
        if (userNewGroupChat.length && groupName) {
            let usersGroup = userNewGroupChat
            usersGroup.push(actualUserId)
            await addDoc(collection(db, 'groupIdUsers'), {
                groupName: groupName,
                groupPhoto: groupPhoto,
                id: id,
                users: usersGroup,
                createdBy: {
                    name: actualUserName,
                    uid: actualUserId
                },
                createdAt: {
                    date: new Date().toLocaleDateString('es', { year: '2-digit' }),
                    hour: new Date().toLocaleTimeString([], { hour12: true })
                }
            })
            navigation.navigate('GroupChatScreen', {
                id: id,
                groupName: groupName,
                groupImage: groupPhoto,
                createdBy: actualUserName,
                isGroupChat: true
            })
            usersGroup = []
            setUsersNewGroupChat([])
            setGroupName('')
            setGroupImage(null)
        }
    }

    async function uploadPhotoAndGetUrl(id) {
        let groupPhoto = ''
        if (groupImage) {
            groupPhoto = await uploadPhotoToStorage('groupChat', groupImage, id, 'groupImage')
        } else {
            let defaultPhoto = 'https://img2.freepng.es/20180422/wlq/kisspng-computer-icons-users-group-laboratory-vector-5add02952b3873.7827208315244335571771.jpg'
            groupPhoto = defaultPhoto
        }
        return groupPhoto
    }
    async function pickPhotoFromLibary() {
        onClose()
        let image = await pickImage()
        /*CONDICIONAL PARA 
       CAMBIAR LA FOTO Y SI SE CANCELA SE MANTIENE LA FOTO ANTERIOR */
        if (image) {
            setGroupImage(image)
        } else {
            setGroupImage(groupImage)
        }

    }

    async function photoWithCamera() {
        onClose()
        let photo = await takePhotoWithCamera()
        /*CONDICIONAL PARA 
        CAMBIAR LA FOTO Y SI SE CANCELA SE MANTIENE LA FOTO ANTERIOR */
        if (photo) {
            setGroupImage(photo)
        } else {
            setGroupImage(groupImage)
        }
    }
    return (
        <View style={styles.container}>
            <ScrollView>
                {newGroup ?
                    <View>
                        <Box p={4} w={'100%'}>
                            <HStack>
                                <Box width={'15%'}>
                                    <View onTouchStart={onOpen}>
                                        <Image source={{ uri: groupImage ? groupImage : cameraIcon }} style={styles.profileImage} />
                                    </View>
                                </Box>
                                <Input
                                    placeholder="Write the group name here..."
                                    fontSize="14"
                                    type='text'
                                    width={'85%'}
                                    variant={'underlined'}
                                    _focus={{ borderColor: 'gray.300' }}
                                    value={groupName}
                                    onChangeText={text => setGroupName(text)}
                                />
                            </HStack>
                            <Text fontSize="xs" mt={2} color='gray.500'>Write a name for the group and pick an image (optional)</Text>
                        </Box>
                  
                            {userNewGroupChat.length ? <Text fontSize="xs" mt={2} color='gray.500'>Write a name for the group and pick an image (optional)</Text> : null}
                    
                        <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
                            <Actionsheet.Content borderTopRadius="20">
                                <Actionsheet.Item
                                    startIcon={<FontAwesome name="image" size={20} color="black" />}
                                    borderRadius={'15'}
                                    onPress={() => pickPhotoFromLibary()}>
                                    Select an image
                                </Actionsheet.Item>
                                <Actionsheet.Item
                                    startIcon={<Feather name="camera" size={20} color="black" />}
                                    borderRadius={'15'}
                                    onPress={() => photoWithCamera()}>
                                    Take a photo
                                </Actionsheet.Item>
                                {groupImage ?
                                    <Actionsheet.Item
                                        startIcon={<FontAwesome5 name="trash" size={20} color='#a1a1aa' />}
                                        borderRadius={'15'}
                                        _text={{ color: 'gray.400' }}
                                        onPress={() => {
                                            setGroupImage(null)
                                            onClose()
                                        }}>
                                        Delete photo
                                    </Actionsheet.Item>
                                    : null}
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
            </ScrollView>
            {newGroup ?
                <IconButton
                    onPress={() => {
                        if (!userNewGroupChat.length) {
                            ToastAndroid.show('Select at least 1 user', ToastAndroid.LONG)
                        }
                        if (!groupName) {
                            ToastAndroid.show('Please, write a name for the group and add an image (optional)', ToastAndroid.LONG)
                        }
                        createNewGroup()
                    }}
                    icon={<AntDesign name="arrowright" size={25} color='white' />}
                    borderRadius="full"
                    position={'absolute'}
                    bottom={10}
                    right={10}
                    p={4}
                    bg={'green.600'}
                    _pressed={{
                        bg: 'green.500'
                    }} />
                : null}
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        flex: 1,
        position: 'relative'
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 50
    }
})
export default AllUsers;
