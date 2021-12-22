import React from 'react'
import { View, Button, Dimensions, StyleSheet, StatusBar, Platform } from 'react-native'
import { Text, Center } from 'native-base';
import globalStyles from '../../styles/global-styles'
const Login = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Button title='Registrarse' onPress={() => navigation.navigate('Register')}></Button>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: globalStyles.windowDimensions.height,
        width: globalStyles.windowDimensions.width
    }

})
export default Login
