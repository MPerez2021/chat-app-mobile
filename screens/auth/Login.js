import React, { useEffect } from 'react'
import { View, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/core';
import { Text, Center, Image, Input, Icon, Stack, Button, Divider, Flex, KeyboardAvoidingView, FormControl, Spinner } from 'native-base';
import globalStyles from '../../styles/global-styles';
/*FIREBASE*/
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
/*ICONS*/
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
const Login = ({ navigation }) => {
    const auth = getAuth();
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const [errors, setErrors] = React.useState("");
    const [showError, setShowError] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const handleShowPassword = () => setShowPassword(!showPassword)
    const insets = useSafeAreaInsets();
    useFocusEffect(
        React.useCallback(() => {
            setEmail("");
            setPassword("");
            setShowPassword(false);
            setIsLoading(false);
            setShowError(false)
        }, [])
    )
    function handleUserLogIn() {
        setIsLoading(true)
        signInWithEmailAndPassword(auth, email, password).then(() => {
            setIsLoading(false)
        }).catch(error => {
            console.log(error.code);
            if (error.code === 'auth/user-not-found') {
                setErrors("User was not found, please verify if your email is correct")
                setShowError(true)
                setIsLoading(false)
            }
            if (error.code === 'auth/wrong-password' || error.code === 'auth/internal-error' || error.code === 'auth/invalid-email') {
                setErrors("Incorrect email or password, please try again")
                setShowError(true)
                setIsLoading(false)
            }
        })
    }

    return (

        <SafeAreaView style={styles.container}>
            <View>
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <FormControl isRequired isInvalid={showError}>
                        <Center>
                            <Image source={require('../../assets/app-logo.png')}
                                size={'2xl'}
                                alt='image'
                            />
                        </Center>
                        <Stack space={4} w="100%" alignItems="center" mt={5}>
                            {showError ?
                                <FormControl.ErrorMessage _text={{ fontSize: 'xs', color: 'error.500', fontWeight: 500 }} >
                                    {errors}
                                </FormControl.ErrorMessage>
                                : null}
                            <KeyboardAvoidingView behavior='padding'>
                                <Stack space={4} w="100%">
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
                                </Stack>
                            </KeyboardAvoidingView>
                            {isLoading ? <Spinner size="sm" /> : <Button colorScheme='info' w={{ base: "80%", md: "20%" }} onPress={handleUserLogIn}>
                                Login
                            </Button>}
                            <Flex direction='row' p={4} alignItems="center">
                                <Divider mx="2" width="35%" />
                                <Text>OR</Text>
                                <Divider mx="2" width="35%" />
                            </Flex>
                            <Button style={{ backgroundColor: '#E8E8E8' }}
                                w={{ base: "80%", md: "20%" }}
                                leftIcon={<AntDesign name="google" size={24} color="black" />}>
                                <Text> Login with google</Text>
                            </Button>
                            <Flex direction='row'>
                                <Text color={'grey'} mr={2} mb={4} >New to app?</Text>
                                <Text color={'blue.600'} bold={true} onPress={() => {
                                    navigation.navigate('Register')
                                    setEmail("");
                                    setPassword("");
                                    setShowPassword(false);
                                }}>Register</Text>
                            </Flex>
                        </Stack>
                    </FormControl>
                </ScrollView>
            </View>
        </SafeAreaView >

    )
}

const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        justifyContent: 'center',
        flex: 1
    }

})
export default Login
