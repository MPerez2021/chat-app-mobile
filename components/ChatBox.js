import React from 'react';
import { Box, Stack, Text, Image, HStack } from 'native-base'
import globalStyles from '../styles/global-styles';

const ChatBox = ({ message, sentBy, sentHour, actualUserUid, isGroupChat, userPhoto, userName}) => {
    const detectImages = () => {
        let pattern = /http?s?:?\/\/.*\.(?:png|jpg|jpeg|gif|png|svg|com)((\/).+)?/;
        return pattern.test(message)
    }
    return (
        <Stack mb={1} w={globalStyles.windowDimensions.width} mt={2} position={'relative'}>
            {sentBy === actualUserUid ?
                <HStack alignSelf={'flex-end'}
                    alignItems={'flex-end'}
                    maxWidth={'70%'}
                    mr={3}
                >
                    <Stack bg={'#2176FF'}
                        borderTopLeftRadius={25}
                        borderTopRightRadius={25}
                        borderBottomLeftRadius={25}
                        maxWidth={isGroupChat ? '90%' : '100%'}>
                        <Box p={2.5}>
                            {detectImages()
                                ? <Image source={{ uri: message }} size={'2xl'} alt='Image' borderRadius={8} />
                                : <Text color={'white'} fontSize={'md'}>{message}</Text>
                            }
                            <Text color={'white'} fontSize={'xs'} textAlign={'right'}>
                                {sentHour}
                            </Text>
                        </Box>
                    </Stack>
                    {isGroupChat ?
                        <Box maxWidth={'10%'} ml={1}>
                            <UserAvatar size={'sm'} source={userPhoto} /></Box>
                        : null}
                </HStack>
                :
                <HStack
                    alignSelf={'flex-start'}
                    alignItems={'flex-end'}
                    maxWidth={'70%'}
                    ml={2} >
                    {isGroupChat ?
                        <Box maxWidth={'15%'} mr={1}>
                            <UserAvatar size={'sm'} source={userPhoto} /></Box>
                        : null}
                    <Stack bg={'gray.50'}
                        borderTopLeftRadius={25}
                        borderTopRightRadius={25}
                        borderBottomRightRadius={25}
                        maxWidth={isGroupChat ? '100%' : '100%'}>
                        <Box p={2.5}>
                            {isGroupChat
                                ? <Text color={'black'} fontSize={'xs'} textAlign={'right'}>
                                    ~ {userName}
                                </Text>
                                : null}
                            {detectImages() ? <Image source={{ uri: message }} size={'2xl'} alt='Image' borderRadius={8} /> : <Text color={'black'} fontSize={'md'}>{message}</Text>}
                            <Text color={'black'} fontSize={'xs'} textAlign={'left'}>
                                {sentHour}
                            </Text>
                        </Box>
                    </Stack>
                </HStack>
            }
        </Stack >
    );
};
export default ChatBox;
