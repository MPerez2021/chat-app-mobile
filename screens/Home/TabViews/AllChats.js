import React, { useEffect } from 'react'
import { View, StyleSheet, FlatList, TouchableHighlight } from 'react-native'
/*NATIVE BASE */
import { HStack, Text, Avatar, VStack, Stack, Badge, Divider, Button, Icon } from 'native-base'
/*FIREBASE*/
import { onSnapshot, doc, getFirestore, addDoc, collection, query, where, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"
/*ICONS */
import { Feather } from '@expo/vector-icons';
/* STYLES */
import globalStyles from '../../../styles/global-styles'

const AllChats = ({ props }) => {
    const db = getFirestore();
    const auth = getAuth();
    const [userChats, setUserChats] = React.useState([])
    const [messageId, setMessageId] = React.useState('')

    useEffect(() => {
        const lastMessagesRef = query(collection(db, 'lastMessages'), where('id', 'array-contains', auth.currentUser.uid))
        const unsubscribe = onSnapshot(lastMessagesRef, chats => {
            let chatsContent = []
            chats.forEach(info => {
                setMessageId(info.id)
                let chat = {
                    chatId: info.id,
                    sentBy: {
                        name: info.data().sentBy.name,
                        photo: info.data().sentBy.photo,
                        uid: info.data().sentBy.uid
                    },
                    message: {
                        text: info.data().message.text,
                        dateSent: info.data().message.dateSent
                    },
                    sentTo: {
                        name: info.data().sentTo.name,
                        photo: info.data().sentTo.photo,
                        read: info.data().sentTo.read,
                        uid: info.data().sentTo.uid
                    }

                }
                chatsContent.push(chat)
            })
            setUserChats(chatsContent)       
        }) 
        return () => {
            unsubscribe()
        };
    }, [])


    const detectImages = (image) => {
        let pattern = /http?s?:?\/\/.*\.(?:png|jpg|jpeg|gif|png|svg|com)((\/).+)?/;
        return pattern.test(image)
    }

    const changeReadStatus = async (item) => {
        const lastMessagesRef = doc(db, 'lastMessages', messageId)
        if (item.sentBy.uid !== auth.currentUser.uid) {
            await updateDoc(lastMessagesRef, {
                'sentTo.read': true
            })
        }
    }

    const sendRoutesParams = (item) => {
        props.navigate('Chat', {
            friendId: item.sentBy.uid === auth.currentUser.uid ? item.sentTo.uid : item.sentBy.uid,
            friendName: item.sentBy.uid === auth.currentUser.uid ? item.sentTo.name : item.sentBy.name,
            profilePhoto: item.sentBy.uid === auth.currentUser.uid ? item.sentTo.photo : item.sentBy.photo,
            actualUserUid: item.sentBy.uid === auth.currentUser.uid ? item.sentBy.uid : item.sentTo.uid,
            actualUserPhoto: item.sentBy.photo === auth.currentUser.uid ? item.sentBy.photo : item.sentTo.photo,
            actualUserName: item.sentBy.name === auth.currentUser.uid ? item.sentBy.name : item.sentTo.name,
        })
    }
    return (
        <View style={styles.container}>
            <Button onPress={() => props.navigate('Users', { newChat: 'New Chat' })}> todos los usuarios </Button>
            <FlatList data={userChats}
                renderItem={({ item }) =>
                    <TouchableHighlight onPress={() => {
                        sendRoutesParams(item)
                        changeReadStatus(item)
                    }}>
                        <View>
                            <Stack bg="white" direction={'row'} padding={4}>
                                <Stack alignSelf={'center'} width={'15%'}>
                                    <Avatar
                                        alignContent="center"
                                        size="md"
                                        source={{
                                            uri: item.sentBy.uid === auth.currentUser.uid ? item.sentTo.photo : item.sentBy.photo
                                        }}
                                        mr={3}
                                    />
                                </Stack>
                                <VStack width={'85%'}>
                                    <Stack justifyContent={"space-between"} direction={'row'}>
                                        <Text fontSize="lg">{item.sentBy.uid === auth.currentUser.uid ? item.sentTo.name : item.sentBy.name}</Text>
                                        <Text fontSize="sm">{item.message.dateSent}</Text>
                                    </Stack>
                                    <Stack justifyContent={"space-between"} direction={'row'} width={'100%'}>
                                        {item.sentBy.uid === auth.currentUser.uid ?
                                            <>
                                                {detectImages(item.message.text) ?
                                                    <HStack>
                                                        <Icon mr="1" size="5" color="muted.500" as={<Feather name="image" />} />
                                                        <Text color={'muted.500'}>Photo</Text>
                                                    </HStack> :
                                                    <Text isTruncated fontSize="sm" maxWidth={globalStyles.windowDimensions.width} w={'85%'} color={'muted.500'}>
                                                        {item.message.text}
                                                    </Text>}
                                            </>
                                            :
                                            <>
                                                {detectImages(item.message.text) ?
                                                    <HStack>
                                                        <Icon mr="1" size="5" as={<Feather name="image" />} />
                                                        <Text>Photo</Text>
                                                    </HStack> :
                                                    <Text isTruncated fontSize="sm" maxWidth={globalStyles.windowDimensions.width} w={'85%'}>
                                                        {item.message.text}
                                                    </Text>}
                                            </>
                                        }
                                        {!item.sentTo.read && item.sentBy.uid !== auth.currentUser.uid ? <Badge
                                            colorScheme="info"
                                            rounded="50"
                                            variant="solid"
                                            alignContent='center'
                                            _text={{
                                                fontSize: 12,
                                            }}
                                            ml={2}
                                        >
                                            New
                                        </Badge> : null}

                                    </Stack>
                                </VStack>
                            </Stack>
                            <Divider />
                        </View>
                    </TouchableHighlight>

                }
                keyExtractor={item => item.chatId}
            />
        </View >
    )
}


const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        flex: 1
    }

})
/*React memo se usa para optmizar el renderizado, comparando los props 
del renderizado actual con el anterior, si son iguales reutiliza y si no lo
son, actualiza el DOM */
export default React.memo(AllChats);
