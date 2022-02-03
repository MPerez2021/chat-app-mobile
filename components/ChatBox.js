import React from 'react';
import { Box, Stack, Text, Image } from 'native-base'
import globalStyles from '../styles/global-styles';


const ChatBox = ({ message, sentBy, sentHour, actualUserUid }) => {
    const detectImages = () => {
        let pattern = /http?s?:?\/\/.*\.(?:png|jpg|jpeg|gif|png|svg|com)((\/).+)?/;
        return pattern.test(message)
    }
    return (
        <Stack mb={1} w={globalStyles.windowDimensions.width} mt={2}>
            {sentBy === actualUserUid ?
                <Stack bg={'#2176FF'}
                    alignSelf={'flex-end'}
                    justifyContent={'flex-end'}
                    direction={'row'}
                    mr={2}
                    borderTopLeftRadius={25}
                    borderBottomLeftRadius={25}
                    borderBottomRightRadius={25}>
                    <Box maxWidth={'70%'} p={2.5}>
                        {detectImages() ? <Image source={{ uri: message }} size={'2xl'} alt='Image' borderRadius={8} /> : <Text color={'white'} fontSize={'md'}>{message}</Text>}
                        <Text color={'white'} fontSize={'xs'} textAlign={'right'}>
                            {sentHour}
                        </Text>
                    </Box>
                </Stack> :
                <Stack bg={'gray.50'}
                    alignSelf={'flex-start'}
                    ml={2}
                    borderTopLeftRadius={25}
                    borderTopRightRadius={25}
                    borderBottomRightRadius={25}>
                    <Box maxWidth={'70%'} p={2.5}>
                        {detectImages() ? <Image source={{ uri: message }} size={'2xl'} alt='Image' borderRadius={8} /> : <Text color={'black'} fontSize={'md'}>{message}</Text>}
                        <Text color={'black'} fontSize={'xs'} textAlign={'left'}>
                            {sentHour}
                        </Text>
                    </Box>
                </Stack>
            }

        </Stack>
    );
};
export default ChatBox;
