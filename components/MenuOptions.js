import React from 'react'
import { Menu, Box, Pressable, IconButton } from 'native-base';
import { SimpleLineIcons } from '@expo/vector-icons';
/*FIREBASE*/
import { getAuth, signOut } from 'firebase/auth'
function MenuOptions({ navigation }) {
    const logOut = () => {
        const auth = getAuth()
        signOut(auth)
    }

    return (
        <Menu width={'170'}
            placement='bottom right'
            trigger={triggerProps => {
                return <IconButton
                    {...triggerProps}
                    icon={<SimpleLineIcons name="options-vertical" size={17} color="black" />}
                    borderRadius="full"                  
                    _pressed={{
                        bg: 'gray.200'
                    }} />
            }}>
            <Menu.Item _text={{ fontSize: 'md' }}>Profile</Menu.Item>
            <Menu.Item
                _text={{ fontSize: 'md' }}
                onPress={() => navigation.navigate('Users', {
                    newChat: 'New Chat'
                })}>
                New Chat
            </Menu.Item>
            <Menu.Item
                _text={{ fontSize: 'md' }}
                onPress={() => navigation.navigate('Users', {
                    newGroup: 'New Group'
                })}>
                New Group
            </Menu.Item>
            <Menu.Item
                _text={{ fontSize: 'md' }}
                onPress={() => logOut()}
            >Log out</Menu.Item>
        </Menu>
    );
}

export default MenuOptions