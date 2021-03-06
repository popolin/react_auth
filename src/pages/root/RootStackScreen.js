import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './SplashScreen'
import SignInScreen from './SignInScreen'
import SignUpScreen from './SignUpScreen'
import TermsScreen from './TermsScreen'
import NotMeScreen from './NotMeScreen'
import ForgotPasswordScreen from './ForgotPasswordScreen'
  
const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
    <RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="SplashScreen" component={SplashScreen}/>
        <RootStack.Screen name="SignInScreen" component={SignInScreen}/>
        <RootStack.Screen name="SignUpScreen" component={SignUpScreen}/>
        <RootStack.Screen name="NotMeScreen" component={NotMeScreen}/>
        <RootStack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen}/>
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