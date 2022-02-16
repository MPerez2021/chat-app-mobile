import React, { useEffect } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import globalStyles from '../../../styles/global-styles'
/*Native base */
import { Box, Text, Input, Stack, VStack, Icon, HStack, KeyboardAvoidingView, IconButton, Actionsheet, useDisclose } from 'native-base'
/*Firebase */
import { getAuth, updateProfile } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore"
/*Icons */
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { pickImage, takePhotoWithCamera, uploadPhotoToStorage } from '../../../services/UploadImages';
function Profile() {

    const [email, setEmail] = React.useState('')
    const [userName, setUserName] = React.useState('')
    const [profilePhoto, setProfilePhoto] = React.useState(null)
    const [joinedDate, setJoinedDate] = React.useState('')
    const [updateUserNameText, setUpdateUserNameText] = React.useState(false)
    const { isOpen, onOpen, onClose } = useDisclose();
    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        setEmail(auth.currentUser.email)
        setUserName(auth.currentUser.displayName)
        setProfilePhoto(auth.currentUser.photoURL)
        setJoinedDate(auth.currentUser.metadata.creationTime)
    }, [])


    const updateUserName = () => {
        setDoc(doc(db, 'users', auth.currentUser.uid), {
            name: userName
        }, { merge: true })
        updateProfile(auth.currentUser, {
            displayName: userName
        })
    }

    const pickPhotoFromLibary = async () => {
        onClose();
        let image = await pickImage();
        if (image) {
            let updatedPhoto = await uploadPhotoToStorage('users', image, auth.currentUser.email, 'profilePhotos')
            setDoc(doc(db, 'users', auth.currentUser.uid), {
                profilePhoto: updatedPhoto
            }, { merge: true })
            updateProfile(auth.currentUser, {
                photoURL: updatedPhoto
            })
            setProfilePhoto(updatedPhoto)
        }
    }

    const photoWithCamera = async () => {
        onClose();
        let image = await takePhotoWithCamera();
        if (image) {
            let updatedPhoto = await uploadPhotoToStorage('users', image, auth.currentUser.email, 'profilePhotos')
            setDoc(doc(db, 'users', auth.currentUser.uid), {
                profilePhoto: updatedPhoto
            }, { merge: true })
            updateProfile(auth.currentUser, {
                photoURL: updatedPhoto
            })
            setProfilePhoto(updatedPhoto)
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
                        <Text fontSize={'sm'}>Email</Text>
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
                    </VStack>
                    <VStack>
                        <Text fontSize={'sm'}>Username</Text>
                        <Input
                            isDisabled={true}
                            value={userName}
                            maxLength={20}
                            onChangeText={text => setUserName(text)}
                            variant="underlined"
                            fontSize={'xl'}
                            InputLeftElement={<MaterialIcons name="alternate-email" size={15} color="gray" />}
                            InputRightElement={
                                <Stack mr={2}>
                                    <MaterialCommunityIcons
                                        name="pencil-outline"
                                        size={20}
                                        color="black"
                                        onPress={() => setUpdateUserNameText(true)} />
                                </Stack>
                            } />
                    </VStack>
                    <HStack alignItems={'center'} justifyContent={'space-between'} bg={'muted.100'} shadow={'2'} padding={4}>
                        <Text fontSize={'sm'}>Change Password</Text>
                        <Icon
                            as={<Feather name="arrow-right" />}
                            size={5}
                        />
                    </HStack>
                </Stack>
                <Box marginTop={'auto'} ml={10} mb={10}>
                    <Text>Joined {joinedDate}</Text>
                </Box>

                {/* Action SHeet */}
                <Actionsheet isOpen={isOpen} onClose={onClose} hideDragIndicator>
                    <Actionsheet.Content borderTopRadius="20">
                        <HStack width={'100%'} p={3} justifyContent={'space-between'} alignItems={'center'}>
                            <Text fontSize={'lg'} bold>Profile foto</Text>
                            <Icon
                                as={<FontAwesome5 name="trash" />}
                                color='#a1a1aa'
                                size={5}
                            />
                        </HStack>
                        <HStack width={'100%'} >
                            <Actionsheet.Item
                                borderRadius={'15'}
                                width={'auto'}
                                height={'auto'}
                                onPress={() => pickPhotoFromLibary()}>
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
                                onPress={() => photoWithCamera()}>
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
            </KeyboardAvoidingView>

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