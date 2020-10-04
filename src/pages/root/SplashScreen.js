import React, {useEffect, useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    StyleSheet,
    StatusBar,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Colors from '../../config/colors.json'

import {useAuth} from '../../context/auth';

const SplashScreen = ({navigation}) => {

  const {preForm, signOut} = useAuth();

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor={Colors.BACKGROUND_SEC} barStyle="light-content"/>
      <View style={styles.header}>
          <Animatable.Image 
              animation="bounceIn"
              duraton="1500"
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="stretch"
          />
          <Animatable.Image 
              animation="bounceIn"
              duraton="1500"
          source={require('../../assets/prontow.png')}
          style={styles.prontow}
          resizeMode="stretch"
          />
      </View>
      <Animatable.View 
          style={styles.footer}
          animation="fadeInUpBig" >
          {
           preForm &&
           <>
              <Text style={styles.title}>
                Olá, {preForm.name}!
              </Text>
              <Text style={styles.description}>
                Bem vindo de volta!{`\n`}Em caso de dúvidas ou problemas, entre em contato conosco.
              </Text>
            </>
          }
          {
           !preForm &&
           <>
              <Text style={styles.title}>
                Conecte-se com seus pacientes!
              </Text>
              <Text style={styles.description}>
                Agenda Médica, Confirmação de Atendimentos via SMS, Guia TISS, Nota Fiscal Eletrônica, Avaliação de Atendimento, Prontuário Eletrônico e Tele-Medicina.
              </Text>
            </>
          }
          
          <View style={styles.button}>
            <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                <LinearGradient
                    colors={Colors.BTN_MAIN_LINEAR}
                    style={styles.signIn}>
                    <Text style={styles.textSign}>{preForm ? 'Continuar' : 'Logue com seu CRM'}</Text>
                    <MaterialIcons 
                        name="navigate-next"
                        color={Colors.BTN_MAIN_TEXT}
                        size={20}
                    />
                </LinearGradient>
            </TouchableOpacity>
          </View>
          {
            preForm &&
            <View style={[styles.textPrivate, {marginTop: 20}]} >
                <Text style={styles.color_textPrivate} onPress={() => {preForm.id ? navigation.navigate('NotMeScreen') : signOut()}}>
                    Você não é <Text style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{preForm.name}</Text>?
                </Text>
            </View>
          }
      </Animatable.View>
    </View>
  );
};

export default SplashScreen;

const {height} = Dimensions.get("screen");
const height_logo = height * 0.13;
const width_prontow = height * 0.44;
const height_prontow = height * 0.12;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: Colors.BACKGROUND_SEC
  },
  header: {
      flex: 2,
      justifyContent: 'center',
      alignItems: 'center'
  },
  footer: {
      flex: 1,
      backgroundColor: Colors.BACKGROUND_MAIN,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingTop: 40,
      paddingBottom: 70,
      paddingHorizontal: 30
  },
  logo: {
      width: height_logo,
      height: height_logo
  },
  prontow: {
    marginTop: 10,
    height: height_prontow,
    width: width_prontow
  },
  title: {
      color: Colors.TITLE_MAIN,
      fontFamily: 'Roboto,sans-serif',
      fontSize: 26,
      letterSpacing: 3,
      textTransform: 'uppercase',
      fontWeight: '700'
  },
  text: {
      color: Colors.TEXT,
      marginTop:5
  },
  description: {
    fontSize:16,
    color: 'grey',
    marginTop: 5,
    fontStyle: 'italic',
    position: 'relative',
    textAlign: 'left',
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30
  },
  signIn: {
      width: 180,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      flexDirection: 'row'
  },
  textSign: {
      color: Colors.BTN_MAIN_TEXT,
      fontWeight: 'bold'
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20
  },
  color_textPrivate: {
      color: Colors.TEXT
  }
  
});

