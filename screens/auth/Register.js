import React from 'react'
import { View, StyleSheet, Platform, Image, ScrollView } from 'react-native'
import { useFocusEffect } from '@react-navigation/core';
/*NATIVE BASE */
import { Text, Center, Input, Icon, Stack, Button, Flex, KeyboardAvoidingView, Avatar, FormControl, Modal, HStack, Spinner } from 'native-base';
import globalStyles from '../../styles/global-styles';
/* EXPO */
import * as ImagePicker from 'expo-image-picker';
/*FIREBASE*/
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore"
import { getStorage, uploadBytes, getDownloadURL, ref } from "firebase/storage"
/*ICONS*/
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
const Register = ({ navigation }) => {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("");
    const [fullName, setFullName] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);
    const [image, setImage] = React.useState(null);
    const [errors, setErrors] = React.useState({ fullName, email, password, image });
    const [showError, setShowError] = React.useState(false)
    const [showModal, setShowModal] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const handleShowPassword = () => setShowPassword(!showPassword);

    useFocusEffect(
        React.useCallback(() => {
            setEmail("");
            setPassword("");
            setFullName("");
            setShowPassword(false);
            setImage(null);
            setIsLoading(false);
        }, [])
    )
    function registerUser() {
        setIsLoading(true)
        const auth = getAuth();
        const db = getFirestore();
        if (emptyFields()) {
            setShowError(true)
            setIsLoading(false)
        } else {
            setShowError(false)
            //var userProfilePhoto = await uploadPhotoToStorage(image)
            createUserWithEmailAndPassword(auth, email, password).then(userCreated => {
                getImageUrlandUpdateToStorage().then(userProfilePhoto => {
                    const user = userCreated.user
                    setDoc(doc(db, 'users', user.uid), {
                        name: fullName,
                        email: email,
                        profilePhoto: userProfilePhoto
                    }, { merge: true })
                    updateProfile(auth.currentUser, {
                        displayName: fullName,
                        photoURL: userProfilePhoto
                    })
                })
                setIsLoading(false)
                setShowModal(true)
            }).catch(error => {
                console.log(error.code);
                setIsLoading(false)
                validateForm(error);
            })

        }
    }
    async function getImageUrlandUpdateToStorage() {
        return await uploadPhotoToStorage(image)
    }

    function emptyFields() {
        if (fullName === "" && email === "" && password === "" && image === null) {
            setErrors({ email: 'This field is required*', fullName: 'This field is required*', password: 'This field is required*', image: 'Please, pick an image*' })
        } else if (fullName === "" && email === "" && password === "") {
            setErrors({ email: 'This field is required*', fullName: 'This field is required*', password: 'This field is required*' })
        } else if (fullName === "" && email === "") {
            setErrors({ email: 'This field is required*', fullName: 'This field is required*' })
        } else if (fullName === "" && password === "") {
            setErrors({ fullName: 'This field is required*', password: 'This field is required*' })
        } else if (email === "" && password === "") {
            setErrors({ email: 'This field is required*', password: 'This field is required*' })
        } else if (email === "") {
            setErrors({ email: 'This field is required*' })
        } else if (fullName === "") {
            setErrors({ fullName: 'This field is required*' })
        } else if (password === "") {
            setErrors({ password: 'This field is required*' })
        } else if (image === null) {
            setErrors({ image: 'Please, pick an image*' })
        } else {
            return false
        }
        return true
    }


    function validateForm(error) {
        switch (error.code) {
            case 'auth/invalid-email':
                setErrors({ email: 'Try again with a valid email direction' })
                setShowError(true)
                break;
            case 'auth/internal-error':

                break;
            case 'auth/missing-email':
                setErrors({ email: 'This field is required*' })
                setShowError(true)
                break;
            case 'auth/email-already-in-use':
                setErrors({ email: 'This email is already in use"' })
                setShowError(true)
                break;
            case 'auth/weak-password':
                setErrors({ password: 'Password should be at least 6 characters' })
                setShowError(true)
            default:
                break;
        }

    }

    const pickImage = async () => {
        let permissionResult = ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }
        // No permissions request is necessary for launching the image library       
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });
        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const uploadPhotoToStorage = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                // return the blob
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                // something went wrong
                reject(new Error('Network request failed'));
            };
            // this helps us get a blob
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
        let imageUrl = uri.split("/ImagePicker/")
        const refR = ref(getStorage(), 'users/' + email + '/' + imageUrl[1])
        const result = await uploadBytes(refR, blob)
        blob.close();
        return getDownloadURL(refR)
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <FormControl isRequired isInvalid={showError}>
                        <Center>
                            <View style={styles.image}>
                                {image ?
                                    <Image source={{ uri: image }} style={styles.profileImage} />
                                    : <Avatar
                                        alignSelf="center"
                                        width="200"
                                        bg={'light.200'}
                                        height="200"
                                        onTouchStart={pickImage}
                                    >
                                        {<Text fontSize={'3xl'}>Add a photo</Text>}
                                    </Avatar>}
                                <View style={styles.addPhotoButton}>
                                    <Button
                                        leftIcon={<Feather name="camera" size={24} color="white" />}
                                        style={{ backgroundColor: '#000' }}
                                        onPress={pickImage} />
                                </View>
                            </View>
                            {showError ?
                                <FormControl.ErrorMessage _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }} >
                                    {errors.image}
                                </FormControl.ErrorMessage>
                                : null}
                        </Center>
                        <Stack space={4} w="100%" alignItems="center" mt={5} flex={1}>
                            <KeyboardAvoidingView behavior="padding">
                                <Stack space={4} w="100%">
                                    <Input
                                        w={{
                                            base: "80%",
                                            md: "20%",
                                        }}
                                        variant={"underlined"}
                                        type="text"
                                        placeholder="Full name"
                                        value={fullName}
                                        size="lg"
                                        onChangeText={text => setFullName(text)}
                                        InputLeftElement={<Icon
                                            as={<SimpleLineIcons name="user" />}
                                            size={5}
                                            ml={2}
                                            color="muted.400"
                                        />} />
                                    {showError ?
                                        <FormControl.ErrorMessage _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }} >
                                            {errors.fullName}
                                        </FormControl.ErrorMessage>
                                        : null}
                                    <Input
                                        w={{
                                            base: "80%",
                                            md: "20%",
                                        }}
                                        variant={"underlined"}
                                        type="text"
                                        placeholder="Email"
                                        value={email}
                                        size="lg"
                                        onChangeText={text => setEmail(text)}
                                        InputLeftElement={<Icon
                                            as={<Entypo name="email" />}
                                            size={5}
                                            ml={2}
                                            color="muted.400"
                                        />} />
                                    {showError ?
                                        <FormControl.ErrorMessage _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }} >
                                            {errors.email}
                                        </FormControl.ErrorMessage>
                                        : null}
                                    <Input
                                        w={{
                                            base: "80%",
                                            md: "20%",
                                        }}
                                        variant={"underlined"}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Password"
                                        value={password}
                                        size="lg"
                                        onChangeText={text => setPassword(text)}
                                        InputLeftElement={<Icon
                                            as={<Feather name="lock" />}
                                            size={5}
                                            ml={2}
                                            color="muted.400"
                                        />}
                                        InputRightElement={<Icon
                                            onPress={handleShowPassword}
                                            as={showPassword ? <MaterialIcons name="visibility" /> : <MaterialIcons name="visibility-off" />}
                                            size={5}
                                            mr={2}
                                            color="muted.400"
                                        />} />
                                    {showError ?
                                        <FormControl.ErrorMessage _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }} >
                                            {errors.password}
                                        </FormControl.ErrorMessage>
                                        : null}
                                </Stack>
                            </KeyboardAvoidingView>
                            {isLoading ? <Spinner size="sm" /> : <Button colorScheme='info' w={{ base: "80%", md: "20%" }} onPress={registerUser}>
                                Continue
                            </Button>}
                            <Flex direction='row'>
                                <Text color={'grey'} mr={2} mb={4}>Joined us before?</Text>
                                <Text color={'blue.600'} bold={true} onPress={() => navigation.navigate('Login')}>Login</Text>
                            </Flex>
                        </Stack>
                    </FormControl>
                    <Modal isOpen={showModal} onClose={() => setShowModal(false)} size={"lg"} closeOnOverlayClick={false}>
                        <Modal.Content >
                            <Modal.CloseButton />
                            <Modal.Body>
                                <HStack alignItems={"center"} mt={3}>
                                    <AntDesign name="checkcircleo" size={24} color="white" style={{ backgroundColor: '#20a779', borderRadius: 50, marginRight: 5 }} />
                                    <Text fontSize="md" pt={3} pr={3} pb={3}>User {fullName}, register successfully, please login to continue.</Text>
                                </HStack>
                                <Button.Group space={1} justifyContent={"flex-end"}>
                                    <Button
                                        variant="ghost"
                                        colorScheme="blueGray"
                                        onPress={() => {
                                            setShowModal(false)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        colorScheme='blue'
                                        endIcon={<AntDesign name="arrowright" size={15} color="white" />}
                                        onPress={() => {
                                            navigation.navigate("Login")
                                            setShowModal(false)
                                        }}
                                    >
                                        Log In
                                    </Button>
                                </Button.Group>
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>
                </ScrollView>

            </View >
        </SafeAreaView >

    )
}
const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        justifyContent: 'center',
        flex: 1
    },
    image: {
        position: 'relative',
    },
    addPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 15
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 150
    }

})
export default Register
