import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { StyleSheet } from 'react-native';
import Login from './screens/auth/Login';
import Register from './screens/auth/Register';
/*NATIVE BASE*/
import { NativeBaseProvider } from 'native-base';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NativeBaseProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Login'
            component={Login}
          />
          <Stack.Screen
            name='Register'
            component={Register} />
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
