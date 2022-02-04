import React, { useEffect } from 'react'
import { View, StyleSheet, TouchableHighlight, FlatList } from 'react-native'
import { HStack, Text, Avatar, VStack, Stack, Badge, Divider, Button } from 'native-base'
import { onSnapshot, doc, getFirestore, addDoc, collection, query, where, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import globalStyles from '../../../styles/global-styles';

const GroupChats = ({ props }) => {
    const db = getFirestore();
    const auth = getAuth();
    const [groupChats, setgroupChats] = React.useState([])

    useEffect(() => {
        const groupRef = query(collection(db, 'groupIdUsers'), where('users', 'array-contains', auth.currentUser.uid))
        const unsubscribe = onSnapshot(groupRef, groups => {
            let groupChatContent = []
            groups.forEach(info => {               
                let group = {
                    documentId: info.id,
                    groupId: info.data().id,
                    name: info.data().name
                }
                groupChatContent.push(group)
            })
            setgroupChats(groupChatContent)
        })
        return () => {
            unsubscribe()
        };
    }, [])


    function navigationParams() {
        props.navigate('Users', {
            newGroup: 'New Group'
        })
    }
    return (
        <View style={styles.container}>
            <Button onPress={() => navigationParams()}> todos los usuarios </Button>
            <FlatList data={groupChats}
                renderItem={({ item }) =>
                    <TouchableHighlight onPress={() => {
                        props.navigate('GroupChatScreen', {
                            id: item.groupId,
                            name: item.name
                        })
                    }}>
                        <View>
                            <Stack bg="white" direction={'row'} padding={4}>
                                <Stack alignSelf={'center'} width={'15%'}>
                                    <Avatar
                                        alignContent="center"
                                        size="md"
                                        source={{
                                            uri: auth.currentUser.photoURL
                                        }}
                                        mr={3}
                                    />
                                </Stack>
                                <VStack width={'85%'}>
                                    <Stack justifyContent={"space-between"} direction={'row'}>
                                        <Text fontSize="lg">{item.name}</Text>
                                        {/* <Text fontSize="sm">{item.message.dateSent}</Text> */}
                                    </Stack>
                                    <Stack justifyContent={"space-between"} direction={'row'} width={'100%'}>


                                    </Stack>
                                </VStack>
                            </Stack>
                            <Divider />
                        </View>
                    </TouchableHighlight>

                }
                keyExtractor={item => item.documentId}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        flex: 1
    }

})
export default GroupChats
