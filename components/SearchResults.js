
import React, { useContext, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableHighlight, Button } from 'react-native'
import OneToOneChatContext from './Context/OneToOneChatContext/CreateContext'
import GroupChatContext from './Context/GroupChatsContext/CreateContext';
import { getAuth } from 'firebase/auth';
import globalStyles from '../styles/global-styles';


function SearchResults({ text, searchStart }) {
    const auth = getAuth()
    const { userChats } = useContext(OneToOneChatContext);
    const { groupChats } = useContext(GroupChatContext)
    const [render, setRender] = React.useState(false)
    const [chats, setChats] = React.useState([])
    const [allGroupChats, setAllGroupChats] = React.useState([])
    const [filteredChats, setFilteredChats] = React.useState([])

    useEffect(() => {
        if (userChats && groupChats) {
            initializeFields()
            filterArray()
           // filterArray2()
        }
    }, [userChats, groupChats, text])

    const initializeFields = () => {
        setChats(userChats);
        setAllGroupChats(groupChats)
    };

    const filterArray = () => {
        if (text !== '') {
            let newArray = allGroupChats.filter(data => {
                return data.groupName.toLowerCase().indexOf(text) > -1;
            })
            setFilteredChats(newArray)
        }
    }

    const filterArray2 = () => {
        if (text !== '') {
            let newArray = chats.filter(data => {
                return data.sentTo.name.toLowerCase().indexOf(text) > -1;
            })
            setFilteredChats(newArray)
        }
    }
    const renderItem = ({ item }) => {
        return (
            <TouchableHighlight /* onPress={() => {
                props.navigate('GroupChatScreen', {
                    id: item.documentId,
                    groupName: item.groupName,
                    createdBy: item.createdBy.name,
                    groupImage: item.groupPhoto,
                    groupUsers: item.users,
                    isGroupChat: true
                })

            }} */>
                <View>
                    <Text>Send By group: {item.groupName}</Text>
                    {/* <Text>Send By one chat: {item.sentTo.name}</Text> */}
                    {/* <Button title='aplstar qui' onPress={() => filterArray()}>aplastar aqui</Button> */}
                </View>
            </TouchableHighlight>
        )
    }

    const EmptyList = () => {
        return (
            <Text>No hay resultados</Text>
        )
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={filteredChats}
                ListEmptyComponent={<EmptyList />}
                renderItem={renderItem}
            />
            <View>
                {/*  <Text>Send By: {item.sentBy.name}</Text> */}
                <Button title='aplstar qui' onPress={() => filterArray()}>aplastar aqui</Button>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width,
        flex: 1
    }
})
export default SearchResults