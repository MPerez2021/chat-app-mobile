import React from 'react'
import { View, StyleSheet } from 'react-native'
import globalStyles from '../../../../styles/global-styles'
/*Native base */
import { VStack, Box, Icon, Text, FormControl, Input, Button } from 'native-base';
/*Firebase */
import { getAuth, updateEmail, reauthenticateWithCredential, EmailAuthProvider, EmailAuthCredential } from "firebase/auth";
import { getFirestore, setDoc, doc, updateDoc } from "firebase/firestore";
/*Icons */

import { AntDesign } from '@expo/vector-icons';
function UpdateEmail() {
    const auth = getAuth();
    const db = getFirestore();
    const [newEmail, setNewEmail] = React.useState('')
    const [confirmNewEmail, setConfirmNewEmail] = React.useState('')
    const [emailssMatch, setEmailsMatch] = React.useState(false)
    const [errors, setErrors] = React.useState('');

    const updateUserEmail = () => {
        if (emailssMatch) {
            updateEmail(auth.currentUser, newEmail).then(() => {
                console.log('Your email and confirmation email must match.');
            })
            updateDoc(doc(db, 'users', auth.currentUser.uid), {               
                email: newEmail,              
            })
        }

    }

    const verifyUserConfirmationEmail = (confirm) => {
        if (newEmail !== confirm) {
            setErrors('Your email and confirmation email must match. ')
            setEmailsMatch(false)
        } else {
            setErrors('')
            setEmailsMatch(true)
        }

    }
    return (
        <View style={styles.container}>
            <VStack space="4" m={10} bg={'gray.100'} shadow={'4'} px="4" pt="4" pb={4}>
                <VStack >
                    <Text fontSize={'md'} textAlign={'center'}>Write your new email</Text>
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
                        value={newEmail}
                        onChangeText={emailValue => setNewEmail(emailValue)}
                    />
                    <FormControl.Label mb={0} mt={2}>Confirm Email</FormControl.Label>
                    <Input
                        variant={'underlined'}
                        size={'md'}
                        placeholder='Confirm email...'
                        value={confirmNewEmail}
                        onChangeText={text => {
                            setConfirmNewEmail(text)
                            verifyUserConfirmationEmail(text)
                        }}
                        InputRightElement={emailssMatch ?
                            <Icon
                                size="5"
                                color={'white'}
                                backgroundColor={'green.600'}
                                borderRadius={50}
                                as={<AntDesign name="checkcircleo" />} /> : null} />
                </FormControl>
                <Button onPress={() => updateUserEmail()}>Update Email</Button>

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
export default UpdateEmail