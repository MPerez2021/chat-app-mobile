import React from 'react'
import { View, StyleSheet } from 'react-native'
import globalStyles from '../../../../styles/global-styles'
/*Native base */
import { VStack, Box, Icon, Text, FormControl, Input, Button, AlertDialog, Center, HStack } from 'native-base';
/*Firebase */
import { getAuth, updatePassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, updateDoc } from "firebase/firestore";
/*Icons */
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from "@expo/vector-icons";
const UpdatePassword = () => {
    const auth = getAuth();
    const db = getFirestore();
    const [newPassword, setNewPassword] = React.useState('')
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('')
    const [passwordsMatch, setPasswordsMatch] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false);
    const [isOpenModal, setIsOpenModal] = React.useState(false);
    const [errors, setErrors] = React.useState('');
    const initialRef = React.useRef(null);
    const updateUserPassword = () => {
        if (passwordsMatch) {
            updatePassword(auth.currentUser, newPassword).then(() => {
                setIsOpenModal(true)
            })
        }
    }

    const verifyUserConfirmationPassword = (confirmPassword) => {
        if (newPassword !== confirmPassword) {
            setErrors('Your password and confirmation password must match. ')
            setPasswordsMatch(false)
        } else {
            setErrors('')
            setPasswordsMatch(true)
        }
    }

    const logOut = () => {
        signOut(auth)
    }

    const PasswordEyeIcon = () => {
        return <Icon
            onPress={() => setShowPassword(!showPassword)}
            as={showPassword ? <MaterialIcons name="visibility" /> : <MaterialIcons name="visibility-off" />}
            size={5}
            mr={2}
            color="muted.400"
        />
    }

    const PasswordMatch = () => {
        return passwordsMatch ?
            <Icon
                size="5"
                color={'white'}
                backgroundColor={'green.600'}
                borderRadius={50}
                as={<AntDesign name="checkcircleo" />} /> : null
    }


    return (
        <View style={styles.container}>
            <VStack space="4" m={10} bg={'gray.100'} shadow={'4'} px="4" pt="4" pb={4}>
                <VStack >
                    <Text fontSize={'md'} textAlign={'center'}>Write your new password</Text>
                </VStack>
                <FormControl isRequired isInvalid={errors}>
                    {errors ? <FormControl.ErrorMessage alignItems={'center'} mt={0} mb={2} _text={{
                        fontSize: 'xs'
                    }}>
                        {errors}
                    </FormControl.ErrorMessage> : null}
                    <FormControl.Label mb={0}>Password</FormControl.Label>
                    <Input
                        variant={'underlined'}
                        type={showPassword ? "text" : "password"}
                        size={'md'}
                        placeholder='Write your password...'
                        value={newPassword}
                        onChangeText={text => setNewPassword(text)}
                        InputLeftElement={<PasswordMatch />}
                        InputRightElement={<PasswordEyeIcon />}
                    />
                    <FormControl.Label mb={0} mt={2}>Confirm Password</FormControl.Label>
                    <Input
                        variant={'underlined'}
                        size={'md'}
                        placeholder='Confirm password...'
                        type={showPassword ? "text" : "password"}
                        value={confirmNewPassword}
                        onChangeText={text => {
                            setConfirmNewPassword(text)
                            verifyUserConfirmationPassword(text)
                        }}
                        InputLeftElement={<PasswordMatch />}
                        InputRightElement={<PasswordEyeIcon />} />
                </FormControl>
                <Button onPress={() => updateUserPassword()}>Update Password</Button>
            </VStack>

            <Center>
                <AlertDialog initialFocusRef={initialRef} isOpen={isOpenModal} onClose={() => setIsOpenModal(false)}>
                    <AlertDialog.Content>
                        <AlertDialog.Header>
                            <HStack alignItems={'center'}>
                                <Icon
                                    size="5"
                                    color={'white'}
                                    backgroundColor={'green.600'}
                                    borderRadius={50}
                                    mr={2}
                                    as={<AntDesign name="checkcircleo" />} />
                                <Text fontSize={'lg'}> Updated successfully</Text>
                            </HStack>
                        </AlertDialog.Header>
                        <AlertDialog.Body>
                            <Text fontSize={'md'}> Please log in again to continue.</Text>
                            <Button
                                ref={initialRef}
                                onPress={() => logOut()}
                                mt={4}
                                alignSelf={'flex-end'}
                                width={20}
                                colorScheme={'blue'}>
                                Ok
                            </Button>
                        </AlertDialog.Body>
                    </AlertDialog.Content>
                </AlertDialog>
            </Center>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        flex: 1,
        justifyContent: 'center'
    }
})

export default UpdatePassword