import React, { useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import Login from './screens/auth/Login';
import Register from './screens/auth/Register';
import Chat from './components/Chat';
/*NATIVE BASE*/
import { NativeBaseProvider } from 'native-base';
import { Icon } from 'native-base';
import { Entypo } from '@expo/vector-icons';
/*FIREBASE*/
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase/config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import Home from './screens/Home/Home';
import AllUsers from './screens/Home/User/AllUsers';

initializeApp(firebaseConfig)
const Stack = createNativeStackNavigator();


function logOut() {
  const auth = getAuth()
  signOut(auth)
}
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
          {!userLogged ? <Stack.Group>
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
                options={{
                  headerRight: () => <Icon as={Entypo} name="log-out" onPress={logOut} />,
                  headerLeft: () => false
                }} />
              <Stack.Screen name='Chat' component={Chat}/>
              <Stack.Screen name='Users' component={AllUsers}/>
            </Stack.Group>}


        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
registerRootComponent(App);