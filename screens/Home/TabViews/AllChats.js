import React from 'react'
import { View, StyleSheet, FlatList, TouchableHighlight } from 'react-native'
/*NATIVE BASE */
import { HStack, Text, Avatar, VStack, Stack, Badge, Divider, Button } from 'native-base'
/* STYLES */
import globalStyles from '../../../styles/global-styles'
const AllChats = ({ props }) => {
    const hola = [
        {
            id: 1,
            photo: 'https://pbs.twimg.com/profile_images/1320985200663293952/lE_Kg6vr_400x400.jpg',
            name: 'Maria Paula',
            date: '17/01/2022',
            message: 'NativeBase gives you a contrasting color based on your theme. You can also customise it using the useAccessibleColors hook.'
        },
        {
            id: 2,
            photo: 'https://s.france24.com/media/display/8c13820c-5b0e-11e9-bf90-005056a964fe/w:1280/p:4x3/gato.jpg',
            name: 'Pedro Parker',
            date: '19/01/2022',
            message: 'NativeBase gives you a contrasting. '
        },
        {
            id: 3,
            photo: 'https://s.france24.com/media/display/8c13820c-5b0e-11e9-bf90-005056a964fe/w:1280/p:4x3/gato.jpg',
            name: 'Pedro Parker',
            date: '19/01/2022',
            message: 'NativeBase gives you a contrasting. NativeBase gives you a contrasting color based on your theme. You can also customise it using the useAccessibleColors hook'
        },
        {
            id: 4,
            photo: 'https://s.france24.com/media/display/8c13820c-5b0e-11e9-bf90-005056a964fe/w:1280/p:4x3/gato.jpg',
            name: 'Pedro Parker',
            date: '19/01/2022',
            message: 'NativeBase gives you a contrasting.'
        }
    ]
    return (
        <View style={styles.container}>
            <Button onPress={() => props.navigate('Users', { newChat: 'New Chat' })}> todos los usuarios </Button>
            <FlatList data={hola}
                renderItem={({ item }) =>
                    <TouchableHighlight onPress={() => props.navigate('Chat')}>
                        <View>
                            <Stack bg="white" direction={'row'} padding={4}>
                                <Stack alignSelf={'center'} width={'15%'}>
                                    <Avatar
                                        alignContent="center"
                                        size="md"
                                        source={{
                                            uri: item.photo
                                        }}
                                        mr={3}
                                    />
                                </Stack>
                                <VStack width={'85%'}>
                                    <Stack justifyContent={"space-between"} direction={'row'}>
                                        <Text fontSize="lg">{item.name}</Text>
                                        <Text fontSize="sm">{item.date}</Text>
                                    </Stack>
                                    <Stack justifyContent={"space-between"} direction={'row'} width={'100%'}>
                                        <Text isTruncated fontSize="sm" maxWidth={globalStyles.windowDimensions.width} w={'85%'}>{item.message}</Text>
                                        <Badge
                                            colorScheme="info"
                                            rounded="50"
                                            variant="solid"
                                            alignContent='center'
                                            _text={{
                                                fontSize: 12,
                                            }}
                                            ml={2}
                                        >
                                            2
                                        </Badge>
                                    </Stack>
                                </VStack>

                            </Stack>
                            <Divider />
                        </View>
                    </TouchableHighlight>

                }
                keyExtractor={item => item.id}
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
