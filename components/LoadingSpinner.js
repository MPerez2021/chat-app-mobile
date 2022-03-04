import React from 'react'
import { Spinner, HStack } from 'native-base'
const LoadingSpinner = ({ loading, size }) => {
    return <>
        {loading && <HStack justifyContent="center" alignItems="center">
            <Spinner size={size} mt={10} />
        </HStack>}
    </>
}

export default LoadingSpinner