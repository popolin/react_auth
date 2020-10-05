import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    StyleSheet,
    ScrollView,
    StatusBar,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../config/colors.json'
import rootStyles from '../../assets/styles/root'

import {validate} from "../../util/Validation"

import {signUp} from '../../services/Auth';
import {useAuth} from '../../context/auth';

import {LinearButton, ClearButton, IconCheck} from '../../components/'
import TextErrorView from '../../components/TextErrorView';


const SignUpScreen = ({navigation}) => {

    const {preForm} = useAuth();

    const [data, setData] = React.useState({
        email: '',
        telefone: '',
        password: '',
        signingUp: false,
        checkEmail: null,
        checkTelefone: null,
        isValidPassword: null,
        secureTextEntry: true
    });

    const handlePhoneChange = (val) => {
      const checkTelefone = validate("telefone", val);
      setData({
        ...data,
        telefone: val,
        checkTelefone
      });
    }

    const handleEmailChange = (val) => {
      const checkEmail = validate("email", val);
      setData({
        ...data,
        email: val,
        checkEmail
      });
    }

    const handlePasswordChange = (val) => {
      const isValidPassword = validate("password", val);
      setData({
        ...data,
        password: val,
        isValidPassword
      });
    }

    const validateEmail = () => {
      return !validate(
        "email", data.email, 
        (error) => setData( prevState => ({...prevState, checkEmail: error})));
    }

    const validatePassword = () => {
      return !validate(
        "password", data.password, 
        (error) => setData( prevState => ({...prevState, isValidPassword: error})));
    }

    const handleSignUp = async() => {
      const emailOK = validateEmail();
      const passwordOK = validatePassword();
      if(emailOK && passwordOK){
        setData({...data, signingUp: true});
        const {password} = data;
        const response = await signUp({...preForm, ...{password}});
        setData({...data, signingUp: false});
        if(response.error){
          Alert.alert('Ops!', response.error, [
            {text: 'Okay'}
          ]);
          return;
        } 
      }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={Colors.BACKGROUND_SEC} barStyle="light-content"/>
        <View style={styles.header}>
        <Text style={styles.text_header}>Bem vindo, {preForm.name}!</Text>

        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {flex: 6}]}>
            <ScrollView>
            <Text style={[styles.text_footer, {marginTop: 0}]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="envelope-o"
                    color={Colors.INPUT_FORM}
                    size={20}
                />
                <TextInput 
                    placeholder="Seu email"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handleEmailChange(val)}
                />

                <IconCheck on={!data.checkEmail } />
                
            </View>
            <TextErrorView message={data.checkEmail} />

            <Text style={[styles.text_footer, {marginTop: 0}]}>Telefone</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="phone"
                    color={Colors.INPUT_FORM}
                    size={20}
                />
                <TextInput 
                    placeholder="Telefone"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePhoneChange(val)}
                />

                <IconCheck on={!data.checkTelefone } />
                
            </View>
            <TextErrorView message={data.checkEmail} />

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
                        color={Colors.ICON_TEXT}
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color={Colors.ICON_TEXT}
                        size={20}
                    />
                    }
                </TouchableOpacity>
            </View>

            <TextErrorView message={data.isValidPassword} />
            <View style={styles.textPrivate}>
                <Text style={styles.color_textPrivate}>
                    Clicando no botão abaixo você estará aceitando os 
                </Text>
                <Text onPress={() =>navigation.navigate('TermsScreen')} style={[styles.color_textPrivate, {fontWeight: 'bold'}]}>{" "}Termos de Uso</Text>
                <Text style={styles.color_textPrivate}>{" "}do Prontow.</Text>
            </View>
            <View style={styles.button}>
              <LinearButton on={data.signingUp} textLoading="Aguarde..." text='Cadastrar' onPress={() => handleSignUp()} />
              <ClearButton text='Voltar' onPress={() => navigation.goBack()} />
            </View>
            </ScrollView>
        </Animatable.View>
      </View>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  ...rootStyles
  });
