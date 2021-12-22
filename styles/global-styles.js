import { Dimensions, StyleSheet } from 'react-native';
const windowHeight = Dimensions.get("window").height
const windowWidth = Dimensions.get("window").width
export default StyleSheet.create({
    windowDimensions :{
        height: windowHeight,
        width: windowWidth,
        backgroundColor:'red'
    }
})