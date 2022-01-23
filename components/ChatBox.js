import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Box, Stack, Text } from 'native-base'
import globalStyles from '../styles/global-styles';


const ChatBox = ({ message, sendBy, hourSend, actualUserUid }) => {
    return (
        <Stack mb={1} w={globalStyles.windowDimensions.width} mt={2}>
            {sendBy === actualUserUid ?
                <Stack bg={'#2176FF'}
                    alignSelf={'flex-end'}
                    mr={2}
                    borderTopLeftRadius={25}
                    borderBottomLeftRadius={25}
                    borderBottomRightRadius={25}>
                    <Box maxWidth={'70%'} p={2}>
                        <Text color={'white'} fontSize={'md'}>
                            {message}
                            <Text color={'white'} fontSize={'md'} bg={'red.200'} marginLeft={10}>
                                {hourSend}
                            </Text>
                        </Text>
                    </Box>
                </Stack> :
                <Stack bg={'#F4F4F4'}
                    alignSelf={'flex-start'}
                    ml={2}
                    borderTopLeftRadius={25}
                    borderTopRightRadius={25}
                    borderBottomRightRadius={25}>
                    <Box maxWidth={'70%'}>
                        <Stack direction={'row'}>
                            <View>
                                <Text color={'black'} fontSize={'md'} p={3}>
                                    {message}
                                </Text>
                            </View>

                            <Text color={'black'} fontSize={'md'} p={3}>
                                {hourSend}
                            </Text>
                        </Stack>
                    </Box>
                </Stack>
            }

        </Stack>
    );
};

const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-end'
    }

})
export default ChatBox;
