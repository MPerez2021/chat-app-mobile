import React from 'react'
import { View } from 'react-native'
import { HStack, Text, Avatar, VStack, Stack, Badge, Divider, Button } from 'native-base'
const GroupChats = ({ props }) => {

    function navigationParams() {
        props.navigate('Users', {
            newGroup: 'New Group'
        })
    }
    return (
        <View>
            <Button onPress={() => navigationParams()}> todos los usuarios </Button>
        </View>
    )
}

export default GroupChats
