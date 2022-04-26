import React, { useContext, useEffect } from 'react'
import { onSnapshot, doc, getFirestore, collection, query, where, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth"
import GroupChatContext from './CreateContext';

export function GroupChatsContextProvider({ children }) {
    const db = getFirestore();
    const auth = getAuth();
    const [groupChats, setgroupChats] = React.useState([])
    const [loaded, setLoaded] = React.useState(false)
    useEffect(() => {
        let skeletonTimer = null
        const groupRef = query(collection(db, 'groupIdUsers'),
            //            orderBy('createdAt.date', 'desc'), orderBy('lastMessage.dateSent','desc'),
            where('groupInfo.users', 'array-contains', auth.currentUser.uid),
        )
        const unsubscribe = onSnapshot(groupRef, groups => {
            let groupChatContent = []
            groups.forEach(info => {
                let group = {
                    documentId: info.id,
                    groupName: info.data().groupInfo.groupName,
                    createdBy: {
                        name: info.data().groupInfo.createdBy.name,
                        uid: info.data().groupInfo.createdBy.uid
                    },
                    createdAt: info.data().groupInfo.createdAt.date,
                    groupPhoto: info.data().groupInfo.groupPhoto,
                    users: info.data().groupInfo.users,
                    message: info.data().lastMessage.message,
                    dateSent: info.data().lastMessage.dateSent,
                    sentBy: {
                        uid: info.data().lastMessage.sentBy.uid,
                        userName: info.data().lastMessage.sentBy.userName
                    }
                }
                groupChatContent.push(group)
            })
            setgroupChats(groupChatContent)
            skeletonTimer = setTimeout(() => {
                setLoaded(true)
            }, 3000)
        })
        return () => {
            unsubscribe();
            clearTimeout(skeletonTimer);
        };
    }, [])
    return (
        <GroupChatContext.Provider value={{ groupChats: groupChats, loaded: loaded, auth: auth }}>
            {children}
        </GroupChatContext.Provider>
    )
}