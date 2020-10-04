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
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';

import Colors from '../../config/colors.json'

import {validate} from "../../util/Validation"

import {useAuth} from '../../context/auth';
import {notMe} from '../../services/Auth';

import {LinearButton, ClearButton, IconCheck} from '../../components'
import TextErrorView from '../../components/TextErrorView';

const NotMeScreen = ({navigation}) => {

    const {preForm, signOut} = useAuth();

    const [data, setData] = React.useState({
        email: '',
        telefone: '',
        anexo: null,
        loading: false,
        checkEmail: validate("email", ""),
        checkTelefone: validate("telefone", ""),
        checkSelfie: validate("anexo", ""),
        submitted: false,
        sent: false,
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
      const options = {
        title: 'Foto com CRM',
        cancelButtonTitle: 'Cancelar',
        takePhotoButtonTitle: 'Câmera',
        chooseFromLibraryButtonTitle: 'Galeria',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };

      ImagePicker.showImagePicker(options, response => {
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

    const validateAnexo = () => {
      return !validate(
        "anexo", data.anexo, 
        (error) => {
          setData( prevState => ({...prevState, checkSelfie: error}))
        });
    }

    const handleNotMe = async() => {
      const emailOK = validateEmail();
      const telefoneOK = validateTelefone();
      const anexoOK = validateAnexo();
      if(emailOK && telefoneOK && anexoOK){
        setData({...data, loading: true, submitted: true});
        const {email, telefone, anexo} = data;
        const response = await notMe(preForm.id, email, telefone, anexo);
        setData({...data, signingUp: false, sent: !response.error});
        if(response.error){
          Alert.alert('Ops!', response.error, [
            {text: 'Okay'}
          ]);
          return;
        } else {
          signOut();
        }
      }
    }


    const onClickAddImage = () => {
      const BUTTONS = ["Câmera", "Galeria", 'Cancelar'];
      ActionSheet.show(
        {options: BUTTONS, cancelButtonIndex: 2, title: 'Foto com CRM'},
        buttonIdex => {
          switch(buttonIdex){
            case 0:
              break;
            case 1:
              break;
            case 2:
              break;
          }
        })
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
              {
                data.sent &&
                <View style={styles.textPrivate}>
                  <Text style={[styles.color_textPrivate, {fontWeight: 'bold', marginBottom: 10}]}>
                      Pedido de revisão enviado
                  </Text>
                  <Text style={styles.color_textPrivate}>
                    Obrigado por denunciar o uso indevido do seu CRM. {`\n`}Entraremos em contato assim que avaliarmos seu caso.
                  </Text>
                  <Text style={[styles.color_textPrivate, {fontWeight: 'bold', marginTop: 10, marginBottom: 10}]}>
                      Dados enviados:
                  </Text>
                </View>
              }
              {
                !data.sent &&
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
              }
            
            {
              !data.sent &&
              <Text style={[styles.text_footer, {marginTop: 0}]}>Email</Text>
            }
            
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
                    editable={!data.sent}
                    onChangeText={(val) => handleEmailChange(val)}
                />
                <IconCheck on={!data.checkEmail} />
                
            </View>
            <TextErrorView message={data.checkEmail && data.submitted} />

            {
              !data.sent &&
              <Text style={[styles.text_footer, {marginTop: 0}]}>Telefone</Text>
            }
            <View style={styles.action}>
                <FontAwesome 
                    name="phone"
                    color="#05375a"
                    size={20}
                />
                
                <TextInput
                    keyboardType='numeric'
                    placeholder="Seu telefone"
                    // mask={"([00]) [0000]-[0000]"}
                    style={styles.textInput}
                    editable={!data.sent}
                    onChangeText={(val) => handleTelefoneChange(val)}
                />

                <IconCheck on={!data.checkTelefone} />
                
            </View>
            <TextErrorView message={data.checkTelefone && data.submitted} />

            {
              !data.sent &&
              <>
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
                  
                  <IconCheck on={data.anexo} />
                
              </View>
              </>
            }
            
            <TextErrorView message={data.checkSelfie && data.submitted} />
            {
              data.anexo &&
              <View style={{marginTop: 10, alignItems: 'center'}}>
                <Image
                  source={{
                    uri: 'data:image/jpeg;base64,' + data.anexo.data,
                  }}
                  style={{ width: 100, height: 100, borderRadius: 5 }}
                />
              </View>
            }

            <View style={styles.button}>
              {
                !data.sent &&
                <LinearButton on={data.loading} textLoading="Aguarde..." text='Enviar' onPress={() => handleNotMe()} />
              }
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
