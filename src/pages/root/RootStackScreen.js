import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import {
  SplashScreen,
  SignInScreen,
  SignUpScreen,
  TermsScreen
} from './';

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
        <RootStack.Screen 
          name="TermsScreen" 
          component={TermsScreen}
          options={{
            title: 'Termos de uso',
            headerStyle: {
              backgroundColor: '#f4511e',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
    </RootStack.Navigator>
);

export default RootStackScreen;