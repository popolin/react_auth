import React from 'react';
import { 
    View, 
    Text, 
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    Alert
} from 'react-native';
import TextInputMask from 'react-native-text-input-mask'
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import Colors from '../../config/colors.json'

import {validate} from "../../util/Validation"

import {useAuth} from '../../context/auth';

import {LinearButton, ClearButton, IconCheck} from '../../components'
import TextErrorView from '../../components/TextErrorView';

const NotMeScreen = ({navigation}) => {

    const [data, setData] = React.useState({
        email: '',
        telefone: '',
        anexo: null,
        signingUp: false,
        checkEmail: null,
        checkTelefone: null,
        checkSelfie: null,
    });

    const handleEmailChange = (val) => {
      const checkEmail = validate("email", val);
      setData({
        ...data,
        email: val,
        checkEmail
      });
    }

    const handleTelefoneChange = (val) => {
      const checkTelefone = validate("telefone", val);
      setData({
        ...data,
        telefone: val,
        checkTelefone
      });
    }

    const handleChoosePhoto = () => {
      console.log('handleChoosePhoto')
      const options = {
        title: 'Selecione a imagem',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      ImagePicker.launchImageLibrary(options, response => {
        console.log(response);
        if (response.uri) {
          setData({ ...data, anexo: response });
        }
      });
    };
  

    const validateEmail = () => {
      return !validate(
        "email", data.email, 
        (error) => setData( prevState => ({...prevState, checkEmail: error})));
    }

    const validateTelefone = () => {
      return !validate(
        "telefone", data.telefone, 
        (error) => setData( prevState => ({...prevState, isValidTelefone: error})));
    }

    const handleNotMe = async() => {
      const emailOK = validateEmail();
      const telefoneOK = validateTelefone();
      if(emailOK && telefoneOK){
        setData({...data, signingUp: true});
        const {password} = data;
        // const response = await signUp({...preForm, ...{password}});
        setData({...data, signingUp: false});
        if(response.error){
          Alert.alert('Ops!', response.error, [
            {text: 'Okay'}
          ]);
          return;
        } 
      }
    }


    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#009387' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Lamentamos o ocorrido!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}>
            <ScrollView>
            <View style={styles.textPrivate}>
                <Text style={[styles.color_textPrivate, {fontWeight: 'bold', marginBottom: 10}]}>
                    Sentimos muito o ocorrido. 
                </Text>
                <Text style={styles.color_textPrivate}>
                  Quem utiliza o CRM de outra pessoa pode responder por falsidade ideológica e estelionato.
                </Text>

                <Text style={[styles.color_textPrivate, {marginTop: 10, marginBottom: 10}]}>
                  Pedimos que você informe os dados abaixo que tomaremos as devidas providências:
                </Text>
            </View>
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
                <IconCheck on={data.checkEmail} />
                
            </View>
            <TextErrorView message={data.checkEmail} />

            <Text style={[styles.text_footer, {marginTop: 0}]}>Telefone</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="phone"
                    color="#05375a"
                    size={20}
                />
                
                <TextInputMask
                    keyboardType='numeric'
                    placeholder="Seu telefone"
                    mask={"([00]) [0000] [0000]"}
                    style={styles.textInput}
                    onChangeText={(val) => handleTelefoneChange(val)}
                />

                <IconCheck on={data.checkTelefone} />
                
            </View>
            <TextErrorView message={data.checkTelefone} />


            <Text style={[styles.text_footer, {marginTop: 0}]}>Foto com documento</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="paperclip"
                    color="#05375a"
                    size={20}
                />
                
                <Text onPress={() => handleChoosePhoto()} 
                  style={[styles.textInput, {marginTop: 1, marginBottom: 15}]} >
                  Anexe uma selfie segurando seu CRM
                  </Text>
                
                <IconCheck on={data.checkSelfie} />
                
            </View>
            <TextErrorView message={data.checkSelfie} />
            {
              data.anexo &&
              <View>
                <Image
                  source={{
                    uri: 'data:image/jpeg;base64,' + data.anexo.resourcePath.data,
                  }}
                  style={{ width: 100, height: 100 }}
                />
                <Image
                  source={{ uri: data.anexo.resourcePath.uri }}
                  style={{ width: 200, height: 200 }}
                />
                <Text style={{ alignItems: 'center' }}>
                  {data.anexo.uri}
                </Text>
              </View>
            }

            <View style={styles.button}>
              <LinearButton on={data.signingUp} textLoading="Aguarde..." text='Enviar' onPress={() => handleNotMe()} />
              <ClearButton text='Voltar' onPress={() => navigation.goBack()} />
            </View>
            </ScrollView>
        </Animatable.View>
      </View>
    );
};

export default NotMeScreen;

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
