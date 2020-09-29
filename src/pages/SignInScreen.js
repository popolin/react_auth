import React, {useState, useEffect} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from 'react-native-paper';

import { AuthContext } from '../../src/components/context';

import LinearButton from '../components/LinearButton'
import ClearButton from '../components/ClearButton'
import AlertView from '../components/AlertView'

import Users from '../../src/models/users';
import UFs from '../../src/config/ufs';
import Colors from '../config/colors.json'

const SignInScreen = ({navigation}) => {


    const cleanMessage = () => {
      setSearch({...search, message: '', error: false})
    }

    const [search, setSearch] = useState({
      userInfo: null,
      searching: false,
      searched: false,
      message: '',
      title: 'Bem vindo!',
      error: false
    });

    const [data, setData] = useState({
      crm: '',
      password: '',
      uf: '',
      ufs: [],
      secureTextEntry: true,
      isValidCRM: false,
      isValidPassword: true
    });

    useEffect(() => {
      if(data.ufs.length === 0){
        setData({...data, ufs: UFs});
      }
    }, []);

    const { colors } = useTheme();

    const { signIn } = React.useContext(AuthContext);

    const handleInputCrm = crmS => {
      const crm = crmS.replace(/[^0-9]/g, '')
      const isValidCRM = crm.trim().length >= 2 && data.uf.length > 0;
      setData({...data, crm, isValidCRM});
    }

    const handleSelectUF = uf => {
      const isValidCRM = data.crm.length >= 2 && uf.length > 0;
      setData({...data, uf, isValidCRM});
    }

    const handlePasswordChange = (val) => {
        if( val.trim().length >= 6 ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const renderSelectUF = () => {
      return (
        <Picker
            prompt="Estado de emissão"
            selectedValue={data.uf}
            style={styles.selectUF}
            enabled={!search.userInfo}
            onValueChange={(itemValue, itemIndex) => handleSelectUF(itemValue)} >
          <Picker.Item label='UF' value='' />
          {
            data.ufs.map( uf => (
              <Picker.Item key={uf.id} label={`${uf.id} - ${uf.description}`} selectedValue={uf.id} value={uf.id} />
            ))
          }
        </Picker>
      )
    }

    const findCrm = () => {
      const {uf, crm} = data;
      cleanMessage();
      setSearch({...search, searching: true })
      setTimeout(async() => {
        const userInfos = Users.filter( item => {
          return uf == item.uf && crm == item.crm;
        });
        const resultadoSearch = {
          userInfo: null,
          searched: true,
          searching: false,
          error: true,
          message: `O CRM '${uf}-${crm}' não existe`,
          title: 'Ops...'
        }
        if(userInfos.length > 0){
          resultadoSearch.userInfo = userInfos[0];
          resultadoSearch.title = `Olá, ${resultadoSearch.userInfo.name}!`;
          resultadoSearch.message = 'Por favor, informe sua senha para continuar'
          resultadoSearch.error = false;
          if(!resultadoSearch.userInfo.id){
            resultadoSearch.message = `Localizamos o seu CRM, porém você ainda não possui cadastro no Prontow. \n\nFaça agora:`
          }
        }
        setSearch({...search, ...resultadoSearch })
      }, 2000);
    }

    const resetForm = () => {
      // this.setData(initialData);
      // this.setSearch(initialSearch);
    }

    const renderReset = () => (
      search.searched &&
      <View style={styles.button}>
        <ClearButton text='Limpar os campos' onPress={() => resetForm()} />
      </View>
    )

    const renderLogin = () => {
      if(search.userInfo && search.userInfo.id){
        return (
          <View>
            <Text style={[styles.text_footer, {
              color: colors.text,
              marginTop: 10}]}>
              Senha
            </Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Senha de acesso"
                    placeholderTextColor={Colors.PLACEHOLDER}
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity
                    onPress={updateSecureTextEntry} >
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
            { data.isValidPassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Sua senha deve ter 6 dígitos.</Text>
            </Animatable.View>
            }

            <TouchableOpacity>
                <Text style={{color: Colors.LINK_TOUCH, marginTop:15}}>Esqueceu a senha?</Text>
            </TouchableOpacity>
            <View style={styles.button}>
              <LinearButton text='Login' onPress={() => loginHandle( data.crm, data.password )} />
            </View>
          </View>
        )
      }
      if (search.userInfo && !search.userInfo.id){
        return (
          <View style={styles.button}>
            <ClearButton text='Cadastre-se' onPress={() => navigation.navigate('SignUpScreen')} />
          </View>
        )
      }
    }
      
    const renderInit = () => (
      !search.userInfo &&
      <View>
        <View style={{...styles.button}, {marginTop: 50} } >
          <LinearButton text='Buscar' textLoading="Buscando..." on={search.searching} styles={{marginTop: 0}} onPress={findCrm} />
        </View>
      </View>
    )
    
    const loginHandle = (uf, crm, password) => {
      if ( uf.length == 0 || crm.length == 0 || password.length == 0 ) {
        Alert.alert('Ops!', 'Os campos UF, CRM e Senha não podem ficar em branco.', [
            {text: 'Okay'}
        ]);
        return;
      }

      if ( foundUser.length == 0 ) {
          Alert.alert('Usuário inválido!', 'UF/CRM ou senha incorretos.', [
              {text: 'Okay'}
          ]);
          return;
      }
      signIn(foundUser);
    }

    return (
      
      <View style={styles.container}>
          <StatusBar backgroundColor={Colors.BACKGROUND_SEC} barStyle="light-content"/>
        <View style={styles.header}>
          <Text style={styles.text_header}>{search.title}</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}>

            <Text style={[styles.text_footer, {
                color: colors.text
            }]}>Informe a UF e número do CRM:</Text>
            <View style={styles.action}>
              <FontAwesome 
                    name="user-o"
                    color={Colors.ICON_GREEN}
                    size={20}
                />
              { renderSelectUF() }
              
              <TextInput 
                    placeholder="Número do CRM"
                    placeholderTextColor={Colors.PLACEHOLDER}
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    editable={!search.userInfo}
                    keyboardType='numeric'
                    autoCapitalize="none"
                    value={data.crm}
                    onChangeText={(val) => handleInputCrm(val) }
                />

              {data.isValidCRM &&
                <Animatable.View
                  animation="bounceIn">
                    <Feather 
                      name="check-circle"
                      color={Colors.ICON_GREEN}
                      size={20}
                  />
                </Animatable.View>
              }

            </View>

            <AlertView error={search.error} message={search.message} />
            { renderInit() }
            { renderLogin() }
            { renderReset()}

        </Animatable.View>
      </View>
    );
};

export default SignInScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: Colors.BACKGROUND_SEC
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: Colors.BACKGROUND_FOOTER,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: Colors.HEADER_TEXT,
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: Colors.FOOTER_TEXT,
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.BTN_BORDER_ACTION,
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.BTN_ERROR,
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: Colors.INPUT_FORM,
    },
    errorMsg: {
        color: Colors.BTN_ERROR,
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 10
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
    selectUF: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      color: Colors.INPUT_FORM,
      maxWidth: 100,
    },
    acaoCrmFind: {

    },
    acaoCrmFindDisabled: {
      opacity: 0.5
    },
    
  });
