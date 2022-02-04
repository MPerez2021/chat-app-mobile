
import React, { useEffect, useLayoutEffect } from 'react';
import { View, Text } from 'react-native';

import { onSnapshot, getFirestore, collection, query} from "firebase/firestore"
const GroupChatScreen = ({ route, navigation }) => {

    const [messages, setMessages] = React.useState([])
    const { id, name } = route.params;
    const db = getFirestore()
    useEffect(() => {
        console.log(id);
        const groupRef = query(collection(db, 'groupChats', id, 'chats'))
        const unsubcribe = onSnapshot(groupRef, querySnapshot => {
            let msgs = []
            querySnapshot.forEach(data => {
                let msg = {
                    message: data.data().message

                }
                msgs.push(msg)
            })
            setMessages(msgs)
        })
        console.log(messages);
        return () => {
            unsubcribe()
        };
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: name
        })
    }, [navigation])

    return (
        <View>
            <Text>{messages.length ? messages[0].message : 'no'}</Text>
        </View>
    );
};

export default GroupChatScreen;

