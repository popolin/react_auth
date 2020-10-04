import React, {useRef} from 'react';
import { 
    View, 
    Text, 
    Image,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    TouchableOpacity, 
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import Feather from 'react-native-vector-icons/Feather';

import Colors from '../../config/colors.json'

import {useAuth} from '../../context/auth';
import {sendCodeForgetPassword, sendCodeEmail, sendCodeSMS} from '../../services/Auth';

import {LinearButton, ClearButton, IconCheck} from '../../components'
import TextErrorView from '../../components/TextErrorView';

const ForgotPasswordScreen = ({navigation}) => {

    const {preForm} = useAuth();

    const [data, setData] = React.useState({
        type: null,
        code: '',
        sending: false,
        preSent: false,
        sent: false,
        isValidPassword: false,
        isValidRePassword: false,
        secureTextEntry: true
    });

    const updateSecureTextEntry = () => {
      setData({
          ...data,
          secureTextEntry: !data.secureTextEntry
      });
  }

    const onSendCode = async(code) => {
      setData({...data, sending: true});
      const response = await sendCodeForgetPassword(preForm.id, code);
      setData({...data, sending: false, sent: !response.error});
      
      if(response.error){
        Alert.alert('Ops!', response.error, [
          {text: 'Okay'}
        ]);
        return;
      }
    }

    const onTypeEmail = async() => {
      const response = await sendCodeEmail(preForm.id);
      setData({...data, type: 'Email', preSent: true});
    }

    const onTypeSMS = async() => {
      const response = await sendCodeSMS(preForm.id);
      setData({...data, type: 'SMS', preSent: true});
    }

    const handleCodeChange = () => {
      setData({
        ...data,
        code
      });
    }

    const handlePasswordChange = () => {

    }

    const handleRePasswordChange = () => {

    }

    
    const renderChangePassword = () => (
      <>
        <View style={styles.textPrivate}>
          <Text style={[styles.color_textPrivate, {fontWeight: 'bold', marginBottom: 10}]}>
              Informe uma nova senha:
          </Text>
        </View>

        <Text style={styles.text_footer}>Senha</Text>
        <View style={styles.action}>
            <Feather 
                name="lock"
                color="#05375a"
                size={20}
            />
            <TextInput 
                placeholder="Sua senha de acesso"
                secureTextEntry={data.secureTextEntry ? true : false}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => handlePasswordChange(val)}
            />
            <TouchableOpacity
                onPress={updateSecureTextEntry}
            >
                {data.secureTextEntry ? 
                <Feather 
                    name="eye-off"
                    color="grey"
                    size={20}
                />
                :
                <Feather 
                    name="eye"
                    color="grey"
                    size={20}
                />
                }
            </TouchableOpacity>
        </View>

        <TextErrorView message={data.isValidPassword} />

        <Text style={styles.text_footer}>Confirmação de Senha</Text>
        <View style={styles.action}>
            <Feather 
                name="lock"
                color="#05375a"
                size={20}
            />
            <TextInput 
                placeholder="Repita sua nova senha"
                secureTextEntry={data.secureTextEntry ? true : false}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => handleRePasswordChange(val)}
            />
            
        </View>

        <TextErrorView message={data.isValidRePassword} />
        
        <View style={styles.button}>
          <LinearButton on={data.sending} textLoading="Aguarde..." text='Enviar' onPress={() => onSendCode( data.code )} />
        </View>
      </>
    )

    const renderCodeSent = () => {
      if (data.type == 'SMS'){
        return (
        <>
          <View style={styles.textPrivate}>
            <Text style={styles.color_textPrivate}>
            {' '}Enviamos o código via SMS para
            </Text>
            <Text style={[styles.color_textPrivate, {fontWeight: 'bold', marginBottom: 10}]}>
              (61) 98181-1212
            </Text>
          </View>
        </>
        )
      } else {
        return (
          <>
          <View style={styles.textPrivate}>
          <Text style={styles.color_textPrivate}>
              Enviamos o código para o email
            </Text>
            <Text style={[styles.color_textPrivate, {fontWeight: 'bold', marginBottom: 10}]}>
              {' '}micpopolin@gmail.com
            </Text>
          </View>
        </>
        )
      }
    }

    const renderCodeRecover = () => (
      <>
        {renderCodeSent()}
        

        <View style={styles.action}>
            <Feather 
                name="lock"
                color={Colors.TEXT}
                size={20}
            />
            <TextInput 
                placeholder="Código de segurança"
                placeholderTextColor={Colors.PLACEHOLDER}
                style={styles.textInput}
                autoCapitalize="none"
                onChangeText={(val) => handleCodeChange(val)}
            />
        </View>
        <View style={styles.button}>
          <LinearButton on={data.sending} textLoading="Aguarde..." text='Enviar' onPress={() => onSendCode( data.code )} />
        </View>
      </>
    )

    const renderTypeRecover = () => (
      <>
        <Text style={[styles.text_footer, {marginTop: 0}]}>Como deseja recuperar sua senha?</Text>
        <TouchableOpacity
          onPress={() => onTypeEmail()}
          style={[styles.linearButtonTouch, {
              borderColor: Colors.BTN_BLUE,
              marginTop: 30
          }]} >
          <Text style={[styles.linearButtonText, {
              color: Colors.BTN_BLUE
          }]}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onTypeSMS}
          style={[styles.linearButtonTouch, {
              borderColor: Colors.BTN_BLUE,
              marginTop: 15
          }]} >
          <Text style={[styles.linearButtonText, {
              color: Colors.BTN_BLUE
          }]}>SMS</Text>
        </TouchableOpacity>
      </>
    )

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#009387' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Esqueceu sua senha?</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}>
            <ScrollView>
              { (!data.preSent && !data.sent) && 
                renderTypeRecover()
              }
              { (data.preSent && !data.sent) && 
                renderCodeRecover()
              }
              { data.sent && 
                renderChangePassword()
              }
              
              <View style={styles.button}>
                <ClearButton text='Voltar' onPress={() => navigation.goBack()} />
              </View>  
            </ScrollView>
        </Animatable.View>
      </View>
    );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#009387'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 28
    },
    text_footer: {
        color: '#05375a',
        marginTop: 20,
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 30
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: Colors.TEXT
    },
    linearButtonTouch: {
      width: '100%',
      height: 50,
      paddingStart: 10,
      justifyContent: 'center',
      alignItems: 'flex-start',
      borderRadius: 10,
      borderWidth: 1,
    },
    linearButtonText: {
      fontSize: 18,
      fontWeight: 'bold'
    },
  
  });
