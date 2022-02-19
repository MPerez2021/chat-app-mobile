import React, { useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View, Text } from 'react-native';
import Login from './screens/auth/Login';
import Register from './screens/auth/Register';
import Chat from './components/Chat';
/*NATIVE BASE*/
import { NativeBaseProvider } from 'native-base';
/*FIREBASE*/
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase/config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
/*SCREENS */
import Home from './screens/Home/Home';
import AllUsers from './screens/Home/User/AllUsers';
import GroupChatScreen from './components/GroupChatScreen';
/*COMPONENTS */
import MenuOptions from './components/MenuOptions';
/*STYLES */
import globalStyles from './styles/global-styles';
import Profile from './screens/Home/User/Profile/Profile';
import VerifyAccount from './screens/Home/User/Profile/VerifyAccount';
import UpdateEmail from './screens/Home/User/Profile/UpdateEmail';


initializeApp(firebaseConfig)
const Stack = createNativeStackNavigator();

export default function App() {
  const [userLogged, setUserLogged] = React.useState(false)
  const auth = getAuth()
  useEffect(() => {
    const verifyIfUserExists = onAuthStateChanged(auth, user => {
      if (user) {
        setUserLogged(true)
      } else {
        setUserLogged(false)
      }
    })
    return () => {
      verifyIfUserExists()
    }
  }, [])

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          {!userLogged ?
            <Stack.Group>
              <Stack.Screen
                name='Login'
                component={Login}
              />
              <Stack.Screen
                name='Register'
                component={Register}
              />
            </Stack.Group> :
            <Stack.Group>
              <Stack.Screen name='Messages'
                component={Home}
                options={({ navigation }) => ({
                  headerRight: () => <MenuOptions navigation={navigation} />,
                  headerLeft: () => false
                })} />
              <Stack.Screen name='Chat' component={Chat} />
              <Stack.Screen name='GroupChatScreen' component={GroupChatScreen} />
              <Stack.Screen name='Users' component={AllUsers} />
              <Stack.Screen name='Profile' component={Profile} />
              <Stack.Screen name='Verify Account' component={VerifyAccount} />
              <Stack.Screen name='Update Email' component={UpdateEmail} />
            </Stack.Group>}


        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    height: globalStyles.windowDimensions.height,
    width: globalStyles.windowDimensions.width,
    flex: 1
  }
});
registerRootComponent(App);