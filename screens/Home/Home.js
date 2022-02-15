import React, { useCallbac, useEffect } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
/*NATIVE BASE */
import { HStack, Input, Icon, StatusBar, Box, Pressable, Center, Text } from 'native-base'
import globalStyles from '../../styles/global-styles'
import { TabView, SceneMap } from 'react-native-tab-view';
/*ICONS*/
import { MaterialIcons } from '@expo/vector-icons';
import AllChats from './TabViews/AllChats';
import GroupChats from './TabViews/GroupChats';
const Home = ({ navigation }) => {

    /*    const [numberOfChats, setNumberOfChats] = React.useState(0)
       function childToParents(childData) {
           console.log(childData.length)    
       } */

    const FirstRoute = () => <AllChats props={navigation}></AllChats>;
    const SecondRoute = () => <GroupChats props={navigation}></GroupChats>;
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'first', title: 'Chats' },
        { key: 'second', title: 'Group Chats' }
    ]);
    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute
    });

    //console.log(numberOfChats);
    const renderTabBar = (props) => {
        /* props.navigationState.routes = devuelve una lista de objetos de las rutas renderizadas en
        pantalla actual */
        const inputRange = props.navigationState.routes.map((x, position) => position);     
        return (
            <Box flexDirection="row">
                {props.navigationState.routes.map((route, i) => {
                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((inputIndex) =>
                            inputIndex === i ? 1 : 0.5
                        ),
                    });
                    const color = index === i ? '#1f2937' : '#a1a1aa';
                    const borderColor = index === i ? 'cyan.500' : 'coolGray.200';
                    return (
                        <Box
                            borderBottomWidth="3"
                            borderColor={borderColor}
                            flex={1}
                            alignItems="center"
                            p="3"
                            key={route.key}
                        >
                            <Pressable
                                onPress={() => {
                                    console.log(i);
                                    setIndex(i);
                                }}>
                                <Animated.Text style={{ color }}>{route.title}</Animated.Text>
                            </Pressable>
                        </Box>
                    );
                })}
            </Box>
        );
    };
    return (
        <View style={styles.container}>
            <HStack bg={'#fff'}>
                <Input
                    placeholder="Search a chat..."
                    width="100%"
                    borderRadius="4"
                    py="3"
                    px="1"
                    fontSize="14"
                    _focus={{ borderColor: 'transparent' }}
                    InputLeftElement={
                        <Icon
                            m="2"
                            ml="3"
                            size="6"
                            color="gray.400"
                            as={<MaterialIcons name="search" />}
                        />
                    }
                    InputRightElement={
                        <Icon
                            m="2"
                            mr="3"
                            size="6"
                            color="gray.400"
                            as={<MaterialIcons name="mic" />}
                        />
                    }
                />

            </HStack>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                onIndexChange={setIndex}
                initialLayout={{ width: globalStyles.windowDimensions.width }}
                lazy
                style={{ marginTop: StatusBar.currentHeight }}
            />
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

export default Home
