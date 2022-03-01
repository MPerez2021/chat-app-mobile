import React, { useRef } from 'react'
import { Icon, IconButton } from 'native-base'
import { AntDesign } from '@expo/vector-icons';
const ScrollToEndButton = ({ showScrollButtom, flatListRef }) => {
    return (
        <>
            {showScrollButtom ? <IconButton
                onPress={flatListRef}
                position={'absolute'}
                bottom={20} right={5}
                icon={<Icon as={AntDesign} name="downcircle" color="black" />}
                borderRadius="full"
                _icon={{
                    backgroundColor: 'white',
                    size: "md",
                    borderRadius: 'full',
                }}
                _pressed={{
                    bg: "transparent"
                }} /> : null}
        </>
    )
}

export default ScrollToEndButton



