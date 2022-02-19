import React, { useEffect } from 'react'
import { View, StyleSheet, Image, TouchableHighlight, ToastAndroid } from 'react-native'
import globalStyles from '../../../../styles/global-styles'
/*Native base */
import {
    Box, Text, Input, Stack, VStack, Icon, HStack, KeyboardAvoidingView,
    IconButton, Actionsheet, useDisclose, Modal, Button, FormControl,
    AlertDialog
} from 'native-base'
/*Firebase */
import { getAuth, updateProfile, updateEmail } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore"
import { getStorage, getDownloadURL, ref } from "firebase/storage"
/*Icons */
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { pickImage, takePhotoWithCamera, uploadPhotoToStorage } from '../../../../services/UploadImages';
function Profile({ navigation }) {

    const [email, setEmail] = React.useState('')
    const [userName, setUserName] = React.useState('')
    const [profilePhoto, setProfilePhoto] = React.useState(null)
    const [joinedDate, setJoinedDate] = React.useState('')
    const [cancelUpdateData, setCancelUpdateData] = React.useState(false)
    const [openDeletePhotoModal, setOpenDeletePhotoModal] = React.useState(false)
    const [showModal, setShowModal] = React.useState(false)
    const { isOpen, onOpen, onClose } = useDisclose();
    const cancelRef = React.useRef(null);
    const maxUserNameLength = 25 - userName.length
    const defaultPhoto = 'https://firebasestorage.googleapis.com/v0/b/chat-app-mobile-8a229.appspot.com/o/userDefaultPhoto%2Fdefault-avatar-profile.jpg?alt=media&token=546e23c0-4444-4f38-83b9-2b19491d11ba'
    const auth = getAuth();
    const db = getFirestore();
    const initialRef = React.useRef(null)
    useEffect(() => {
        setEmail(auth.currentUser.email)
        setUserName(auth.currentUser.displayName)
        setProfilePhoto(auth.currentUser.photoURL)
        setJoinedDate(auth.currentUser.metadata.creationTime)
        setCancelUpdateData(false)
    }, [cancelUpdateData])


    const updateUserName = () => {
        setDoc(doc(db, 'users', auth.currentUser.uid), {
            name: userName
        }, { merge: true })
        updateProfile(auth.currentUser, {
            displayName: userName
        })
    }

  
    const updatePhotoProfileFromLibrary = async () => {
        onClose();
        let image = await pickImage();
        if (image) {
            let updatedPhoto = await uploadPhotoToStorage('users', image, auth.currentUser.email, 'profilePhotos')
            setDoc(doc(db, 'users', auth.currentUser.uid), {
                profilePhoto: updatedPhoto
            }, { merge: true })
            updateProfile(auth.currentUser, {
                photoURL: updatedPhoto
            }).then(() => {
                ToastAndroid.show('Updated profile photo', ToastAndroid.SHORT)
            })
            setProfilePhoto(updatedPhoto)
        }
    }

    const updatePhotoProfileWithCamera = async () => {
        onClose();
        let image = await takePhotoWithCamera();
        if (image) {
            let updatedPhoto = await uploadPhotoToStorage('users', image, auth.currentUser.email, 'profilePhotos')
            setDoc(doc(db, 'users', auth.currentUser.uid), {
                profilePhoto: updatedPhoto
            }, { merge: true })
            updateProfile(auth.currentUser, {
                photoURL: updatedPhoto
            }).then(() => {
                ToastAndroid.show('Updated profile photo', ToastAndroid.SHORT)
            })
            setProfilePhoto(updatedPhoto)
        }
    }

    const deleteProfilePhoto = async () => {
        const refR = ref(getStorage(), 'userDefaultPhoto/default-avatar-profile.jpg')
        const defaultPhoto = await getDownloadURL(refR)
        if (profilePhoto !== defaultPhoto) {
            setDoc(doc(db, 'users', auth.currentUser.uid), {
                profilePhoto: defaultPhoto
            }, { merge: true })
            updateProfile(auth.currentUser, {
                photoURL: defaultPhoto
            }).then(() => {
                ToastAndroid.show('Deleted profile photo', ToastAndroid.SHORT)
            })
            setProfilePhoto(defaultPhoto)
            setOpenDeletePhotoModal(false)
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior="padding">
                <Stack alignItems={'center'} mt={'10'}>
                    <Box position={'relative'}>
                        <Image
                            style={styles.profileImage}
                            source={{ uri: profilePhoto }} />
                        <IconButton
                            position={'absolute'}
                            bottom={0}
                            right={3}
                            p={3}
                            onPress={onOpen}
                            icon={<FontAwesome name="camera" size={20} color="white" />}
                            bg={'black'}
                            borderRadius="full"
                            _pressed={{
                                bg: 'gray.400'
                            }} />
                    </Box>
                    <Text fontSize={'4xl'} mt={2}>{userName}</Text>
                </Stack>
                <Stack space={4} mr={10} ml={10} mt={10} justifyContent='center'>
                    <VStack>
                        <FormControl.Label>Email</FormControl.Label>
                        <TouchableHighlight onPress={() => navigation.navigate('Verify Account')}>
                            <Input
                                isDisabled={true}
                                variant="underlined"
                                value={email}
                                fontSize={'xl'}
                                InputRightElement={
                                    <Stack mr={2}>
                                        <MaterialCommunityIcons name="pencil-outline" size={20} color="black" />
                                    </Stack>
                                } />
                        </TouchableHighlight>
                    </VStack>
                    <TouchableHighlight onPress={() => setShowModal(true)} >
                        <VStack>
                            <FormControl.Label>Username</FormControl.Label>
                            <Input
                                isDisabled={true}
                                value={userName}
                                maxLength={20}
                                onChangeText={text => {
                                    setUserName(text)
                                }}
                                variant="underlined"
                                fontSize={'xl'}
                                InputLeftElement={<MaterialIcons name="alternate-email" size={15} color="gray" />}
                                InputRightElement={
                                    <Stack mr={2}>
                                        <MaterialCommunityIcons
                                            name="pencil-outline"
                                            size={20}
                                            color="black"
                                        />
                                    </Stack>
                                } />
                        </VStack>
                    </TouchableHighlight>
                    <HStack alignItems={'center'} justifyContent={'space-between'} bg={'muted.100'} shadow={'2'} padding={4}>
                        <Text fontSize={'sm'}>Change Password</Text>
                        <Icon
                            as={<Feather name="arrow-right" />}
                            size={5}
                        />
                    </HStack>
                </Stack>
                {/*  <Box marginTop={'auto'} ml={10} mb={10}>
                <Text>Joined {joinedDate}</Text>
            </Box> */}
            </KeyboardAvoidingView>
            {/* Action SHeet */}
            <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
                <Actionsheet.Content borderTopRadius="20">
                    <HStack width={'100%'} p={3} justifyContent={'space-between'} alignItems={'center'}>
                        <Text fontSize={'lg'} bold>Profile foto</Text>
                        {profilePhoto !== defaultPhoto ? <Icon
                            onPress={() => {
                                onClose();
                                setOpenDeletePhotoModal(true)
                            }}
                            as={<FontAwesome5 name="trash" />}
                            color='#a1a1aa'
                            size={5}
                        /> : null}

                    </HStack>
                    <HStack width={'100%'} >
                        <Actionsheet.Item
                            borderRadius={'15'}
                            width={'auto'}
                            height={'auto'}
                            onPress={() => updatePhotoProfileFromLibrary()}>
                            <VStack alignItems={'center'}>
                                <Box borderColor={'gray.200'}
                                    borderWidth={1}
                                    borderRadius={'full'}
                                    p={3}>
                                    <Icon
                                        as={<Entypo name="images" />}
                                        color='black'
                                        size={5}
                                        w={'100%'}
                                    />
                                </Box>
                                <Text fontSize={'md'}>Gallery</Text>
                            </VStack>
                        </Actionsheet.Item>
                        <Actionsheet.Item
                            borderRadius={'15'}
                            width={'auto'}
                            height={'auto'}
                            onPress={() => updatePhotoProfileWithCamera()}>
                            <VStack alignItems={'center'}>
                                <Box borderColor={'gray.200'}
                                    borderWidth={1}
                                    borderRadius={'full'}
                                    p={3}>
                                    <Icon
                                        as={<Feather name="camera" />}
                                        color='black'
                                        size={5}
                                    />
                                </Box>
                                <Text fontSize={'md'}>Camera</Text>
                            </VStack>
                        </Actionsheet.Item>
                    </HStack>
                </Actionsheet.Content>
            </Actionsheet>

            {/*MODAL FOR EDIT USERNAME */}
            <Modal isOpen={showModal} onClose={() => {
                setShowModal(false)
                setCancelUpdateData(true)
            }} justifyContent="flex-end" size="full" initialFocusRef={initialRef}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Write your username</Modal.Header>
                    <Modal.Body>
                        <Input
                            value={userName}
                            maxLength={25}
                            onChangeText={text => setUserName(text)}
                            ref={initialRef}
                            variant="underlined"
                            fontSize={'md'}
                            InputRightElement={<Text>{maxUserNameLength}</Text>}
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                                setShowModal(false);
                                setCancelUpdateData(true)
                            }}>
                                Cancel
                            </Button>
                            <Button onPress={() => {
                                updateUserName()
                                setShowModal(false);
                            }}>
                                Save
                            </Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
            {/*Modal for delete user profile photo */}
            <AlertDialog isOpen={openDeletePhotoModal} onClose={() => setOpenDeletePhotoModal(false)}>
                <AlertDialog.Content>
                    <AlertDialog.Body p={5}>
                        <Text fontSize={'md'}>Delete profile photo?</Text>
                        <Button.Group space={2} mt={4} justifyContent={'flex-end'}>
                            <Button
                                variant="unstyled"
                                colorScheme="coolGray"
                                onPress={() => setOpenDeletePhotoModal(false)}
                                ref={cancelRef}>
                                Cancel
                            </Button>
                            <Button colorScheme="danger" onPress={() => deleteProfilePhoto()}>
                                Delete
                            </Button>
                        </Button.Group>
                    </AlertDialog.Body>
                </AlertDialog.Content>
            </AlertDialog>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        flex: 1
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 100
    }
})
export default Profile