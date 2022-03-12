import React, { useEffect } from 'react'
import OneToOneChatContext from './CreateContext'
import { onSnapshot, getFirestore, collection, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth"
export function OneToOneChatContextProvider({ children }) {

    const db = getFirestore();
    const auth = getAuth();
    const [userChats, setUserChats] = React.useState([])
    const [messageId, setMessageId] = React.useState('')
    const [loaded, setLoaded] = React.useState(false)
    useEffect(() => {
        let skeletonTimer = null
        const lastMessagesRef = query(collection(db, 'lastMessages'), where('id', 'array-contains', auth.currentUser.uid))
        const unsubscribe = onSnapshot(lastMessagesRef, chats => {
            let chatsContent = []
            chats.forEach(info => {
                setMessageId(info.id)
                let chat = {
                    chatId: info.id,
                    sentBy: {
                        name: info.data().sentBy.name,
                        photo: info.data().sentBy.photo,
                        uid: info.data().sentBy.uid
                    },
                    message: {
                        text: info.data().message.text,
                        dateSent: info.data().message.dateSent
                    },
                    sentTo: {
                        name: info.data().sentTo.name,
                        photo: info.data().sentTo.photo,
                        read: info.data().sentTo.read,
                        uid: info.data().sentTo.uid
                    }
                }
                chatsContent.push(chat)
            })
            setUserChats(chatsContent)
            skeletonTimer = setTimeout(() => {
                setLoaded(true)
            }, 3000)
        })
        return () => {
            unsubscribe()
            clearTimeout(skeletonTimer)
        };
    }, [])
    return (
        <OneToOneChatContext.Provider value={{
            userChats: userChats,
            messageId: messageId,
            loaded: loaded,
            auth: auth
        }}>
            {children}
        </OneToOneChatContext.Provider>
    )
}

