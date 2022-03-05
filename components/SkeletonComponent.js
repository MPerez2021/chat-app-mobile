import { View, StyleSheet } from 'react-native'
import React from 'react'
import { Skeleton , Stack, VStack, Divider} from 'native-base'
import globalStyles from '../styles/global-styles'

function SkeletonComponent() {
    return (
        <View style={styles.container}>
            <Stack bg="white" direction={'row'} padding={4}>
                <Stack alignSelf={'center'} width={'15%'}>
                    <Skeleton size={10} rounded='full' />
                </Stack>
                <VStack width={'85%'}>
                    {/*User name and date sent */}
                    <Stack justifyContent={"space-between"} direction={'row'}>
                        <Skeleton.Text lines={1} />
                        <Skeleton.Text lines={1} />
                    </Stack>
                    {/*Message and badge of new message */}
                    <Stack justifyContent={"space-between"} direction={'row'} width={'100%'}>
                        <Skeleton.Text lines={1} />
                        <Skeleton w="10" rounded="50" />
                    </Stack>
                </VStack>
            </Stack>
            <Divider />
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
export default SkeletonComponent