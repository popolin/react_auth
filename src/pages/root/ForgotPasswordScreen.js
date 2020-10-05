import React from 'react';
import { 
    View, 
    Text, 
    TextInput,
    StyleSheet,
    ScrollView,
    StatusBar,
    TouchableOpacity, 
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';

import Feather from 'react-native-vector-icons/Feather';

import Colors from '../../config/colors.json'
import rootStyles from '../../assets/styles/root'

import {useAuth} from '../../context/auth';
import {sendCodeForgetPassword, sendCodeEmail, sendCodeSMS, changePassword} from '../../services/Auth';

import {LinearButton, ClearButton, IconCheck} from '../../components'
import TextErrorView from '../../components/TextErrorView';

import {validate} from "../../util/Validation"

const ForgotPasswordScreen = ({navigation}) => {

    const {preForm} = useAuth();

    const [data, setData] = React.useState({
        type: null,
        code: '',
        password: '',
        rePassword: '',
        sending: false,
        preSent: false,
        sent: false,
        changed: false,
        isValidCode: null,
        isValidPassword: null,
        isValidRePassword: null,
        secureTextEntry: true
    });

    const updateSecureTextEntry = () => {
      setData({
          ...data,
          secureTextEntry: !data.secureTextEntry
      });
    }

    const onChangePassword = async() => {
      const {password, rePassword} = data;

      const passwordOK = !validate("password", password);
      const rePasswordOK = passwordOK && !data.isValidRePassword;

      if(passwordOK && rePasswordOK){
        setData({...data, sending: true});
        const response = await changePassword(preForm.id, password, rePassword);
        setData({...data, sending: false, changed: !response.error});
      }

    }

    const onSendCode = async() => {

      const {code} = data;
      if(code.trim().length == 0){
        setData({...data, isValidCode: 'Você deve informar o código'});  
        return;
      }
      
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
      sendCodeEmail(preForm.id);
      setData(prevState => ({ ...prevState, type: 'Email', preSent: true }));
    }

    const onTypeSMS = async() => {
      sendCodeSMS(preForm.id);
      setData(prevState => ({ ...prevState, type: 'SMS', preSent: true }));
    }

    const handleCodeChange = code => {
      setData({ ...data, code });
    }
    
    const handlePasswordChange = password => {
      const isValidPassword = validate("password", password)
      setData(prevState => ({ ...prevState, isValidPassword, password }));
    }

    const handleRePasswordChange = rePassword => {
      let isValidRePassword = null;
      if(data.password !== rePassword){
        isValidRePassword = "Confirmação de senha inválida";
      }
      setData(prevState => ({ ...prevState, rePassword, isValidRePassword }));
    }

    const PasswordChanged = ({when}) => (
      when &&
      <>
        <Text style={[styles.text_footer, {marginTop: 0}]}>Sua senha foi alterada com sucesso!</Text>
        <View style={styles.textPrivate}>
          <Text style={[styles.color_textPrivate, {fontWeight: 'bold', marginBottom: 10}]}>
              Por favor, faça o login novamente utilizando sua nova senha:
          </Text>
        </View>
      </> 
    )
    
    const ChangePassword = (when) => (
      when &&
      <>
        <Text style={styles.text_footer}>Defina uma nova senha:</Text>
        
        <Text style={styles.text_footer}>Senha</Text>
        <View style={styles.action}>
            <Feather 
                name="lock"
                color={Colors.INPUT_FORM}
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
                    color={Colors.TEXT}
                    size={20}
                />
                :
                <Feather 
                    name="eye"
                    color={Colors.TEXT}
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
                color={Colors.INPUT_FORM}
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
          <LinearButton on={data.sending} textLoading="Aguarde..." text='Alterar Senha' onPress={() => onChangePassword()} />
        </View>
      </>
    )

    const CodeSent = () => {
      if (data.type == 'SMS'){
        return (
        <>
          <View style={styles.textPrivate}>
            <Text style={styles.color_textPrivate}>
            {' '}Enviamos o código via SMS para
            </Text>
            <Text style={[styles.color_textPrivate, {fontWeight: 'bold', marginBottom: 10}]}>
              {preForm._telefone}
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
              {` ${preForm._email}`}
            </Text>
          </View>
        </>
        )
      }
    }

    const CodeRecover = (when) => (
      when && 
      <>
        <Text style={[styles.text_footer, {marginTop: 0}]}>Qual o código de segurança?</Text>
        <CodeSent />
        <View style={styles.action}>
            <Feather 
                name="key"
                color={Colors.TEXT}
                size={20}
            />
            <TextInput 
                placeholder="Código de segurança"
                placeholderTextColor={Colors.PLACEHOLDER}
                style={styles.textInput}
                onChangeText={(val) => handleCodeChange(val)}
            />
        </View>
        <TextErrorView message={data.isValidCode} />
        
        <View style={styles.button}>
          <LinearButton on={data.sending} textLoading="Aguarde..." text='Enviar' onPress={() => onSendCode( data.code )} />
        </View>
      </>
    )

    const TypeRecover = ({when}) => (
      when &&
      <>
        <Text style={[styles.text_footer, {marginTop: 0}]}>Como deseja recuperar sua senha?</Text>
        <TouchableOpacity
          onPress={() => onTypeEmail()}
          style={[styles.linearBlueButton, {
              borderColor: Colors.BTN_BLUE,
              marginTop: 30
          }]} >
          <Text style={[styles.linearBlueButtonText, {
              color: Colors.BTN_BLUE
          }]}>Email</Text>
          <Text style={styles.linearBlueButtonDetail}>({preForm._email})</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onTypeSMS()}
          style={[styles.linearBlueButton, {
          }]} >
          <Text style={[styles.linearBlueButtonText, {
              color: Colors.BTN_BLUE
          }]}>SMS</Text>
          <Text style={styles.linearBlueButtonDetail}>({preForm._telefone})</Text>
        </TouchableOpacity>
      </>
    )

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.BACKGROUND_SEC} barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Esqueceu sua senha?</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}>
            <ScrollView>
              <TypeRecover when={!data.preSent && !data.sent} />
              { CodeRecover(data.preSent && !data.sent) }
              
              { ChangePassword(data.sent && !data.changed) }
              <PasswordChanged when={data.sent && data.changed} />

              
              <View style={[styles.button, {marginTop: 15}]}>
                <ClearButton text={data.changed ? 'Voltar para Login' : 'Cancelar'} onPress={() => navigation.goBack()} />
              </View>  
            </ScrollView>
        </Animatable.View>
      </View>
    );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
    ...rootStyles,
});
