import { View, Text } from 'react-native';
import React from 'react';
import { Avatar } from 'native-base'
const UserAvatar = (props) => {
    return (
        <Avatar
            alignItems='center'
            size={props.size}
            source={{
                uri: props.source
            }}
            marginLeft={props.marginLeft}
            marginRight={props.marginRight}
        />
    );
};

export default UserAvatar;
