import React, { useContext, useEffect } from 'react'
import { View, StyleSheet, FlatList, TouchableHighlight } from 'react-native'
/*NATIVE BASE */
import { HStack, Text, Avatar, VStack, Stack, Badge, Divider, IconButton, Icon, Skeleton, Spinner, Heading } from 'native-base'
/*FIREBASE*/
import { onSnapshot, doc, getFirestore, collection, query, where, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"
/*ICONS */
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

/* STYLES */
import globalStyles from '../../../styles/global-styles'
import SkeletonComponent from '../../../components/SkeletonComponent';
import OneToOneChatContext from '../../../components/Context/OneToOneChatContext/CreateContext';

const AllChats = ({ props }) => {
    const db = getFirestore();
    //const auth = getAuth();
    const { userChats, messageId, loaded, auth } = useContext(OneToOneChatContext);
    const [checkIfUserHaveChats, setCheckIfUserHaveChats] = React.useState(false)

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
            actualUserPhoto: item.sentBy.uid === auth.currentUser.uid ? item.sentBy.photo : item.sentTo.photo,
            actualUserName: item.sentBy.uid === auth.currentUser.uid ? item.sentBy.name : item.sentTo.name,
        })
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableHighlight onPress={() => {
                sendRoutesParams(item)
                changeReadStatus(item)
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
                                            uri: item.sentBy.uid === auth.currentUser.uid ? item.sentTo.photo : item.sentBy.photo
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
                                        <Text fontSize="lg">{item.sentBy.uid === auth.currentUser.uid ? item.sentTo.name : item.sentBy.name}</Text>
                                    </>
                                </Skeleton.Text>
                                <Skeleton.Text isLoaded={loaded}>
                                    <>
                                        <Text fontSize="sm">{item.message.dateSent}</Text>
                                    </>
                                </Skeleton.Text>
                            </Stack>
                            <Stack justifyContent={"space-between"} direction={'row'} width={'100%'} alignItems='center'>
                                <Skeleton.Text w={'80%'} isLoaded={loaded} numberOfLines={1}>
                                    <>
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
                                                    <HStack >
                                                        <Icon mr="1" size="5" as={<Feather name="image" />} />
                                                        <Text>Photo</Text>
                                                    </HStack> :
                                                    <Text isTruncated fontSize="sm" maxWidth={globalStyles.windowDimensions.width} w={'85%'}>
                                                        {item.message.text}
                                                    </Text>}
                                            </>
                                        }
                                    </>
                                </Skeleton.Text>
                                <Skeleton w={'15%'} borderRadius={10} h={'3'} isLoaded={loaded}>
                                    <>
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
                                    </>
                                </Skeleton>
                            </Stack>
                        </VStack>
                    </Stack>
                    <Divider />
                </View>

            </TouchableHighlight >

        );
    }

    const EmptyList = () => {
        setTimeout(() => {
            if (!userChats.length) {
                setCheckIfUserHaveChats(true)
            }
        }, 1000);
        return (
            <HStack justifyContent='center'>
                {checkIfUserHaveChats ? <EmptyChats /> : <LoadingSpinner />}
            </HStack>
        )
    }

    const LoadingSpinner = () => {
        return (<HStack space={2} justifyContent='center'>
            <Spinner size={'lg'} color="cyan.500" />
            <Heading color="cyan.500" fontSize="2xl">
                Loading...
            </Heading>
        </HStack>
        )
    }

    const EmptyChats = () => {
        return (
            <HStack>
                <Text textAlign={'center'} fontSize={20}>A??n no tienes mensajes, inicia una nueva conversaci??n.</Text>
            </HStack>
        )
    }
    return (
        <View style={styles.container}>
            <FlatList data={userChats}
                ListEmptyComponent={<EmptyList />}
                renderItem={renderItem}
                contentContainerStyle={!userChats.length ? styles.loadingSpinner : null}
                keyExtractor={(item, index) => String(index)}
            />

            <IconButton
                onPress={() => props.navigate('Users', { newChat: 'New Chat' })}
                icon={<MaterialIcons name="chat" size={24} color="white" />}
                position='absolute'
                bottom={10}
                right={5}
                p={4}
                bg={'blue.400'}
                borderRadius="full"
                _pressed={{
                    bg: 'blue.500'
                }} />
        </View >
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
/*React memo se usa para optmizar el renderizado, comparando los props 
del renderizado actual con el anterior, si son iguales reutiliza y si no lo
son, actualiza el DOM */
export default React.memo(AllChats);
