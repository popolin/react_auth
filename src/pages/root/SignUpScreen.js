import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import Colors from '../../config/colors.json'

import {validate} from "../../util/Validation"

import {signUp} from '../../services/Auth';
import {useAuth} from '../../context/auth';

import {LinearButton, ClearButton} from '../../components/'
import TextErrorView from '../../components/TextErrorView';

const SignUpScreen = ({navigation}) => {

    const {preForm} = useAuth();

    const [data, setData] = React.useState({
        email: '',
        password: '',
        signingUp: false,
        checkEmail: null,
        isValidPassword: null,
        secureTextEntry: true
    });

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
          <StatusBar backgroundColor='#009387' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Bem vindo, André!</Text>

        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}>
            <ScrollView>
            <Text style={[styles.text_footer, {marginTop: 0}]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="envelope-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Seu email"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => handleEmailChange(val)}
                />
                {!data.checkEmail ? 
                <Animatable.View
                    animation="bounceIn">
                    <Feather 
                        name="check-circle"
                        color="green"
                        size={20}
                    />
                </Animatable.View>
                : null}
            </View>
            <TextErrorView message={data.checkEmail} />

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
        fontSize: 30
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
        marginTop: 50
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
    }
  });
