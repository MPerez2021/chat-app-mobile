import React from 'react';
import { Box, Stack, Text } from 'native-base'
import globalStyles from '../styles/global-styles';


const ChatBox = ({ message, sentBy, sendtHour, actualUserUid }) => {
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
                        <Text color={'white'} fontSize={'md'}>
                            {message}
                        </Text>
                        <Text color={'white'} fontSize={'xs'} textAlign={'right'}>
                            {sendtHour}
                        </Text>
                    </Box>
                </Stack> :
                <Stack bg={'#F4F4F4'}
                    alignSelf={'flex-start'}
                    ml={2}
                    borderTopLeftRadius={25}
                    borderTopRightRadius={25}
                    borderBottomRightRadius={25}>
                    <Box maxWidth={'70%'} p={2.5}>
                        <Text color={'black'} fontSize={'md'}>
                            {message}
                        </Text>
                        <Text color={'black'} fontSize={'xs'} textAlign={'left'}>
                            {sendtHour}
                        </Text>
                    </Box>
                </Stack>
            }

        </Stack>
    );
};
export default ChatBox;
