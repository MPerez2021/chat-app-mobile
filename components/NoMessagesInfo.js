import React from 'react'
import { Text, Box } from 'native-base'

const NoMessagesInfo = () => {
    return (
        <Box mt={3} maxWidth={200} alignSelf={'center'} borderRadius={'5'} bg={'muted.100'}>
            <Text p={2} textAlign={'center'}>Send the first message to start a conversation</Text>
        </Box>
    )
}

export default NoMessagesInfo