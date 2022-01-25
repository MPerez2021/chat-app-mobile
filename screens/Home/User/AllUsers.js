import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableHighlight, ScrollView } from 'react-native';
import globalStyles from '../../../styles/global-styles';
/*NATIVE BASE */
import { HStack, Text, Avatar, VStack, Stack, Badge, Divider, Button } from 'native-base'
/*FIREBASE */
import { collection, query, getFirestore, onSnapshot, setDoc, doc, getDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import UserAvatar from '../../../components/UserAvatar';

const AllUsers = ({ navigation }) => {
    const db = getFirestore()
    const auth = getAuth()
    const [users, setUsers] = React.useState([])
    useEffect(() => {
        const getAllUsers = query(collection(db, 'users'))
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

    async function createNewChat(friendId, name) {
        const user = auth.currentUser
        navigation.navigate('Chat', {
            friendId: friendId,
            friendName: name,
            actualUserUid: user.uid,
            profilePhoto: user.photoURL
        })

    }
    return (
        <View style={styles.container}>
            <ScrollView>
                {users.map(user =>
                    <View key={user.id}>
                        {user.id !== auth.currentUser.uid ?
                            <TouchableHighlight onPress={() => createNewChat(user.id, user.name)}>
                                <View>
                                    <Stack bg="white" direction={'row'} padding={4}>
                                        <Stack alignSelf={'center'} width={'15%'}>
                                            <UserAvatar size='md' source={user.photo} marginRight={3} />
                                        </Stack>
                                        <VStack width={'85%'}>
                                            <Text fontSize="lg">{user.name}</Text>
                                            <Text fontSize="md">{user.email}</Text>
                                        </VStack>
                                    </Stack>
                                    <Divider />
                                </View>
                            </TouchableHighlight> : null}
                    </View>

                )}
            </ScrollView>
            {/* <FlatList
                data={users}
                renderItem={({ item }) =>
                    <TouchableHighlight onPress={() => createNewChat(item.id)}>
                        <View>
                            <Stack bg="white" direction={'row'} padding={4}>
                                <Stack alignSelf={'center'} width={'15%'}>
                                    <Avatar
                                        alignContent="center"
                                        size="md"
                                        source={{
                                            uri: item.photo
                                        }}
                                        mr={3}
                                    />
                                </Stack>
                                <VStack width={'85%'}>
                                    <Text fontSize="lg">{item.name}</Text>
                                    <Text fontSize="md">{item.email}</Text>
                                </VStack>
                            </Stack>
                            <Divider />
                        </View>
                    </TouchableHighlight>
                }
                keyExtractor={item => item.id}

            />
 */}

        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        flex: 1
    }

})
export default AllUsers;
