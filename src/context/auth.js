import React, {createContext, useState, useEffect, useContext} from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { createDrawerNavigator } from '@react-navigation/drawer';
const Drawer = createDrawerNavigator();

import RootStackScreen from '../pages/root/RootStackScreen';
import {DrawerContent} from '../pages/home/DrawerContent';
import BookmarkScreen from '../pages/home/BookmarkScreen';
import MainTabScreen from '../pages/home/MainTabScreen';

import * as auth from '../services/Auth';
import Storage, {
  AUTH_PRE_FORM, 
  AUTH_USER, 
  AUTH_TOKEN} from '../util/Storage'
import api from '../services/Api';

const AuthContext = createContext();

const AuthProvider = ({children}) => {

  const [user, setUser] = useState(null);
  const [preForm, setPreForm] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storagedPreForm = await Storage.getItemJson(AUTH_PRE_FORM);
      const storagedUser = await Storage.getItemJson(AUTH_USER);
      const storagedToken = await Storage.getItem(AUTH_TOKEN);

      if (storagedUser && storagedToken) {
        setUser(storagedUser);
        api.defaults.headers.Authorization = `Baerer ${storagedToken}`;
      }

      if(storagedPreForm){
        setPreForm(storagedPreForm);
      }

      setLoading(false);
    }

    loadStorageData();
  }, []);

  async function signIn(uf, crm, password) {
    const response = await auth.signIn(uf, crm, password);
    if(response.user){
      const {user} = response;
      api.defaults.headers.Authorization = `Baerer ${response.token}`;
      await Storage.setItemJson(AUTH_USER, response.user);
      await Storage.setItem(AUTH_TOKEN, response.token);
      setUser(user);
    } else {
      return response.error;
    }
  }

  async function preSignIn(uf, crm) {
    const response = await auth.preSignIn(uf, crm);
    if(response.user){
      setPreForm(response.user);
      await Storage.setItemJson(AUTH_PRE_FORM, response.user);
    } else {
      return response.error;
    }
  }

  async function signOut() {
    await Storage.clear();

    setPreForm(null);
    setUser(null);
  }

  if( loading ) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return (
    <AuthContext.Provider
      value={{signed: !!user, user, preForm, preSignIn, signIn, signOut}}>
      {children}
      <NavigationContainer>
          { !!user ? (
            <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
              <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
              <Drawer.Screen name="BookmarkScreen" component={BookmarkScreen} />
            </Drawer.Navigator>
          )
        :
          <RootStackScreen/>
        }
        </NavigationContainer>
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}

export {AuthProvider, useAuth};