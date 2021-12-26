import React from 'react'
import { View, StyleSheet } from 'react-native'
import { useFocusEffect } from '@react-navigation/core';
import { Text, Center, Image, Input, Icon, Stack, Button, Divider, Flex, KeyboardAvoidingView, ScrollView } from 'native-base';
import globalStyles from '../../styles/global-styles';

/*ICONS*/
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
const Login = ({ navigation }) => {
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [showPassword, setShowPassword] = React.useState(false)
    const handleShowPassword = () => setShowPassword(!showPassword)

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
                <Center>
                    <Image source={{ uri: "https://wallpaperaccess.com/full/317501.jpg" }}
                        size={"2xl"}
                        alt='image' />
                </Center>
                <Stack space={4} w="100%" alignItems="center" mt={5}>
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
                    <Button colorScheme='info' w={{ base: "80%", md: "20%" }}>
                        Login
                    </Button>
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
                        <Text color={'grey'} mr={2} >New to app?</Text>
                        <Text color={'blue.600'} bold={true} onPress={() => {
                            navigation.navigate('Register')
                            setEmail("");
                            setPassword("");
                            setShowPassword(false);
                        }}>Register</Text>
                    </Flex>
                </Stack>
            </KeyboardAvoidingView >
        </View>


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
