import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    StyleSheet,
    StatusBar,
    Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';

import Colors from '../config/colors.json'

const SplashScreen = ({navigation}) => {
    const { colors } = useTheme();

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor={Colors.BACKGROUND_SEC} barStyle="light-content"/>
        <View style={styles.header}>
            <Animatable.Image 
                animation="bounceIn"
                duraton="1500"
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="stretch"
            />
            <Animatable.Image 
                animation="bounceIn"
                duraton="1500"
            source={require('../assets/prontow.png')}
            style={styles.prontow}
            resizeMode="stretch"
            />
        </View>
        <Animatable.View 
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
            animation="fadeInUpBig" >
            <Text style={[styles.title, {
                color: colors.text
            }]}>Conecte-se com seus pacientes!</Text>
            <Text style={styles.terms}>
              Ao logar você estará concordando{'\n'}com os 
              <Text onPress={() =>navigation.navigate('TermsScreen')} style={styles.termosButtonText}>
                &nbsp;termos de uso
              </Text> 
            </Text>
            <View style={styles.button}>
            <TouchableOpacity onPress={()=>navigation.navigate('SignInScreen')}>
                <LinearGradient
                    colors={Colors.BTN_MAIN_LINEAR}
                    style={styles.signIn}>
                    <Text style={styles.textSign}>Logue com o CRM</Text>
                    <MaterialIcons 
                        name="navigate-next"
                        color={Colors.BTN_MAIN_TEXT}
                        size={20}
                    />
                </LinearGradient>
            </TouchableOpacity>
            </View>
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
      paddingVertical: 50,
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
      fontSize: 30,
      fontWeight: 'bold'
  },
  text: {
      color: Colors.TEXT,
      marginTop:5
  },
  terms: {
    fontSize:14,
    color: 'grey',
    marginTop:5
  },
  button: {
      alignItems: 'flex-end',
      marginTop: 30
  },
  signIn: {
      width: 170,
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
  
  termosButtonText: {
    fontSize:14,
    fontWeight: 'bold',
    color: 'grey',
    marginStart: 4,
    marginTop: 0,
  }
});

