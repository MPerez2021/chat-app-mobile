import React from 'react'
import { View, StyleSheet } from 'react-native'
import globalStyles from '../../../../styles/global-styles'
/*Native base */
import { VStack, Box, Icon, Text, FormControl, Input, Button } from 'native-base';
/*Firebase */
import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
/*Icons */
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from "@expo/vector-icons";

function VerifyAccount({ navigation, route }) {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [showPassword, setShowPassword] = React.useState(false);
    const [errors, setErrors] = React.useState('');
    const { updateEmail } = route.params;
    const auth = getAuth();

    const promptForCredentials = () => {
        return EmailAuthProvider.credential(email, password)
    }

    const validateUserAccount = () => {
        const credentials = promptForCredentials()
        let screenName = 'Update Password'
        if (updateEmail) {
            screenName = 'Update Email'
        }

        reauthenticateWithCredential(auth.currentUser, credentials).then(() => {
            setErrors('')
            setEmail('')
            setPassword('')
            navigation.navigate(screenName)
        }).catch(error => {
            controlFormErrors(error)
        })
    }

    const controlFormErrors = (error) => {
        switch (error.code) {
            case 'auth/wrong-password':
                setErrors('Invalid email or password.');
                break;
            case 'auth/internal-error':
                setErrors('Fields cannot be empty.')
                break;
            case 'auth/user-mismatch':
                setErrors('Invalid email or password.')
                break;
            case 'auth/invalid-email':
                setErrors('Invalid email or password')
                break;
            default:
                break;
        }
    }

    return (
        <View style={styles.container}>
            <VStack space="4" m={10} bg={'gray.100'} shadow={'4'} px="4" pt="4" pb={4}>
                <Box alignItems={'center'}>
                    <FontAwesome5 name="user-lock" size={80} color="black" />
                </Box>
                <VStack >
                    <Text fontSize={'md'} textAlign={'center'}>We ask this to make sure the account belongs to you.</Text>
                    <Text fontSize={'md'} textAlign={'center'} bold>{auth.currentUser.email}</Text>
                </VStack>
                <FormControl isRequired isInvalid={errors}>
                    {errors ? <FormControl.ErrorMessage alignItems={'center'} mt={0} mb={2} _text={{
                        fontSize: 'xs'
                    }}>
                        {errors}
                    </FormControl.ErrorMessage> : null}
                    <FormControl.Label mb={0}>Email</FormControl.Label>
                    <Input
                        variant={'underlined'}
                        size={'md'}
                        placeholder='Write your email...'
                        value={email}
                        onChangeText={textValue => setEmail(textValue)}
                    />
                    <FormControl.Label mb={0} mt={2}>Password</FormControl.Label>
                    <Input
                        variant={'underlined'}
                        size={'md'}
                        placeholder='Write your password...'
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChangeText={passwordValue => setPassword(passwordValue)}
                        InputRightElement={<Icon
                            onPress={() => setShowPassword(!showPassword)}
                            as={showPassword ? <MaterialIcons name="visibility" /> : <MaterialIcons name="visibility-off" />}
                            size={5}
                            mr={2}
                            color="muted.400"
                        />} />
                </FormControl>
                <Button onPress={() => validateUserAccount()}>Continue</Button>
            </VStack>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        flex: 1,
        justifyContent: 'center'
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 100
    }
})
export default VerifyAccount