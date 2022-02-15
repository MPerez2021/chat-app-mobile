import React, { useEffect } from 'react'
import { View, StyleSheet, TouchableHighlight, FlatList } from 'react-native'
import { HStack, Text, Avatar, VStack, Stack, IconButton, Divider, Button, Icon } from 'native-base'
import { onSnapshot, doc, getFirestore, addDoc, collection, query, where, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import globalStyles from '../../../styles/global-styles';
/*ICONS */
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
const GroupChats = ({ props }) => {
    const db = getFirestore();
    const auth = getAuth();
    const [groupChats, setgroupChats] = React.useState([])
    useEffect(() => {
        const groupRef = query(collection(db, 'groupIdUsers'), where('groupInfo.users', 'array-contains', auth.currentUser.uid))
        const unsubscribe = onSnapshot(groupRef, groups => {
            let groupChatContent = []
            groups.forEach(info => {
                let group = {
                    documentId: info.id,
                    groupName: info.data().groupInfo.groupName,
                    createdBy: {
                        name: info.data().groupInfo.createdBy.name,
                        uid: info.data().groupInfo.createdBy.uid
                    },
                    createdAt: info.data().groupInfo.createdAt.date,
                    groupPhoto: info.data().groupInfo.groupPhoto,
                    users: info.data().groupInfo.users,
                    message: info.data().lastMessage.message,
                    dateSent: info.data().lastMessage.dateSent,
                    sentBy: {
                        uid: info.data().lastMessage.sentBy.uid,
                        userName: info.data().lastMessage.sentBy.userName
                    }
                }
                groupChatContent.push(group)
            })
            setgroupChats(groupChatContent)
        })
        return () => {
            unsubscribe();

        };
    }, [])

    const detectImages = (image) => {
        let pattern = /http?s?:?\/\/.*\.(?:png|jpg|jpeg|gif|png|svg|com)((\/).+)?/;
        return pattern.test(image)
    }
    return (
        <View style={styles.container}>
            <FlatList data={groupChats}
                renderItem={({ item }) =>
                    <TouchableHighlight onPress={() => {
                        props.navigate('GroupChatScreen', {
                            id: item.documentId,
                            groupName: item.groupName,
                            createdBy: item.createdBy.name,
                            groupImage: item.groupPhoto,
                            groupUsers: item.users,
                            isGroupChat: true
                        })
                    }}>
                        <View>
                            <Stack bg="white" direction={'row'} padding={4}>
                                <Stack alignSelf={'center'} width={'15%'}>
                                    <Avatar
                                        alignContent="center"
                                        size="md"
                                        source={{
                                            uri: item.groupPhoto
                                        }}
                                        mr={3}
                                    />
                                </Stack>
                                <VStack width={'85%'}>
                                    <Stack justifyContent={"space-between"} direction={'row'}>
                                        <Text fontSize="lg">{item.groupName}</Text>
                                        <Text fontSize="sm">{item.message ? item.dateSent : item.createdAt}</Text>
                                    </Stack>
                                    <Stack direction={'row'}>
                                        {detectImages(item.message) ?
                                            <HStack>
                                                <Text isTruncated fontSize="sm" maxWidth={globalStyles.windowDimensions.width} color={'muted.500'}>
                                                    {item.sentBy.uid === auth.currentUser.uid ? 'Me: ' : item.sentBy.userName + ': '}
                                                </Text>
                                                <Icon mr="1" size="5" color="muted.500" as={<Feather name="image" />} />
                                                <Text color={'muted.500'}>Photo</Text>
                                            </HStack> :
                                            <>
                                                {!item.message ?
                                                    <Text isTruncated fontSize="sm" maxWidth={globalStyles.windowDimensions.width} w={'85%'} color={'muted.500'}>
                                                        {item.createdBy.uid === auth.currentUser.uid ? 'Has creado un nuevo grupo ' : item.createdBy.name + ' te ha añadido a este grupo'}
                                                    </Text>
                                                    : <Text isTruncated fontSize="sm" maxWidth={globalStyles.windowDimensions.width} w={'85%'} color={'muted.500'}>
                                                        {item.sentBy.uid === auth.currentUser.uid ? 'Me: ' : item.sentBy.userName + ': '}
                                                        {item.message}
                                                    </Text>}

                                            </>
                                        }
                                    </Stack>
                                </VStack>
                            </Stack>
                            <Divider />
                        </View>
                    </TouchableHighlight>
                }
                keyExtractor={item => item.documentId}
            />

            <IconButton
                onPress={() => props.navigate('Users', {
                    newGroup: 'New Group'
                })}
                icon={<Ionicons name="add" size={24} color="white" />}
                position='absolute'
                bottom={10}
                right={5}
                p={4}
                bg={'blue.400'}
                borderRadius="full"
                _pressed={{
                    bg: 'blue.500'
                }} />
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
