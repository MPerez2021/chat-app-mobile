import React, { useEffect, createContext, useContext } from 'react'
import { View, StyleSheet, TouchableHighlight, FlatList } from 'react-native'
import { HStack, Text, Avatar, VStack, Stack, IconButton, Divider, Skeleton, Spinner, Icon, Heading } from 'native-base'
import { onSnapshot, doc, getFirestore, collection, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import globalStyles from '../../../styles/global-styles';
/*ICONS */
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import GroupChatContext from '../../../components/Context/GroupChatsContext/createContext';

const GroupChats = ({ props }) => {
   
    /* const [groupChats, setgroupChats] = React.useState([])
    const [loaded, setLoaded] = React.useState(false) */
    const { groupChats, loaded, auth } = useContext(GroupChatContext)
    /* 
        useEffect(() => {
            let skeletonTimer = null
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
                skeletonTimer = setTimeout(() => {
                    setLoaded(true)
                }, 3000)
            })
            console.log('hola 2');
            return () => {
                unsubscribe();
                clearTimeout(skeletonTimer);
            };
        }, []) */

    const detectImages = (image) => {
        let pattern = /http?s?:?\/\/.*\.(?:png|jpg|jpeg|gif|png|svg|com)((\/).+)?/;
        return pattern.test(image)
    }

    const renderItem = ({ item }) => {
        return (
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
                    <Stack bg={loaded ? 'white' : null} direction={'row'} padding={4}>
                        <Stack alignSelf={'center'} width={'15%'}>
                            <Skeleton size={10} borderRadius={'full'} isLoaded={loaded}>
                                <>
                                    <Avatar
                                        alignContent="center"
                                        size="md"
                                        source={{
                                            uri: item.groupPhoto
                                        }}
                                        mr={3}
                                    />
                                </>
                            </Skeleton>
                        </Stack>
                        <VStack width={'85%'}>
                            <Stack justifyContent={"space-between"} direction={'row'}>
                                <Skeleton.Text isLoaded={loaded} >
                                    <>
                                        <Text fontSize="lg">{item.groupName}</Text>
                                    </>
                                </Skeleton.Text>
                                <Skeleton.Text isLoaded={loaded}>
                                    <>
                                        <Text fontSize="sm">{item.message ? item.dateSent : item.createdAt}</Text>
                                    </>
                                </Skeleton.Text>
                            </Stack>
                            <Stack direction={'row'}>
                                <Skeleton.Text w={'80%'} isLoaded={loaded} numberOfLines={1}>
                                    <>
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
                                    </>
                                </Skeleton.Text>
                            </Stack>
                        </VStack>
                    </Stack>
                    <Divider />
                </View>
            </TouchableHighlight>
        )
    }

    const LoadingSpinner = () => {
        return (
            <HStack space={2} justifyContent='center'>
                <Spinner size={'lg'} color="cyan.500" />
                <Heading color="cyan.500" fontSize="2xl">
                    Loading...
                </Heading>
            </HStack>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList data={groupChats}
                ListEmptyComponent={<LoadingSpinner />}
                renderItem={renderItem}
                contentContainerStyle={!groupChats.length ? styles.loadingSpinner : null}
                keyExtractor={(item, index) => String(index)}
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
    },
    loadingSpinner: {
        marginTop: 'auto', marginBottom: 'auto'
    }

})
export default React.memo(GroupChats);
