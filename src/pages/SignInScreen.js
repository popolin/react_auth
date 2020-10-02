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

import { AuthContext } from '../../src/components/context';

import LinearButton from '../components/LinearButton'
import ClearButton from '../components/ClearButton'
import AlertView from '../components/AlertView'

import Users from '../../src/models/users';
import Locations from '../util/Locations';
import Permissions from '../util/Permissions';
import Api from '../services/Api'
import Colors from '../config/colors.json'

import {asyncStore, recoverStore, USER} from '../util/Storages'

const SignInScreen = ({navigation, route}) => {


    const cleanMessage = () => {
      setSearch({...search, message: '', error: false})
    }

    const initialData = {
      crm: '',
      password: '',
      uf: '',
      ufs: [],
      logging: false,
      secureTextEntry: true,
      isValidCRM: false,
      isValidPassword: true
    };

    const initialSearch = {
      userInfo: null,
      searching: false,
      searched: false,
      title: 'Bem vindo!',
      error: null
    };

    const [search, setSearch] = useState(initialSearch);
    const clearSearch = () => {
      setSearch({ ...initialSearch });
    };

    const [data, setData] = useState(initialData);
    const clearData = () => {
      const ufs = Locations.ufs();
      setData({ ...initialData, ufs });
    };

    useEffect(() => {
      
      recoverStore(USER, user => {
        configUser(user);
      });
      
      if(data.ufs.length === 0){
        setData(prevState => ({ ...prevState, ufs: Locations.ufs() }));
        Permissions.executeWithGeolocation(localizacaoLiberada);
      }
    }, []);

    const { signIn } = React.useContext(AuthContext);


    const localizacaoLiberada = () => {
      Api.findAddressByCurrentLatLng(resultado => {
        setData(prevState => ({ ...prevState, uf: resultado.sigla_uf }));
      }) 
    }

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

    const configUser = (userInfo) => {
      if(userInfo){
        const resultadoSearch = {
          userInfo,
          searched: true,
          title: `Olá, ${userInfo.name}!`
        }
        setSearch(resultadoSearch);
        
        const {crm, uf, isValidCRM = true} = userInfo
        setData(prevState => ({ ...prevState, crm, uf, isValidCRM }));
      }
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
          error: `CRM '${uf}-${crm}' não encontrado`,
          title: 'Ops...'
        }
        if(userInfos.length > 0){
          const user = userInfos[0]
          asyncStore(USER, user);
          resultadoSearch.userInfo = user;
          resultadoSearch.title = `Olá, ${user.name}!`;
        }
        setSearch({...search, ...resultadoSearch })
      }, 2000);
    }

    const resetForm = () => {
      clearData();
      clearSearch();
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
          <View style={{marginTop:20}}>
            <Text style={styles.text_footer}>
              Informe sua senha para continuar:
            </Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color={Colors.TEXT}
                    size={20}
                />
                <TextInput 
                    placeholder="Senha de acesso"
                    placeholderTextColor={Colors.PLACEHOLDER}
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={styles.textInput}
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
              <LinearButton on={data.logging} text='Login' onPress={() => loginHandle( data.password )} />
            </View>
          </View>
        )
      }
      if (search.userInfo && !search.userInfo.id){
        return (
          <View>
            <AlertView message={`Localizamos o seu CRM, porém você ainda não possui cadastro no Prontow. \n\nCadastre agora:`} />
            <View style={styles.button}>
              <LinearButton text='Cadastrar' onPress={() => navigation.navigate('SignUpScreen')} />
            </View>
          </View>
        )
      }
    }
      
    const renderInit = () => (
      !search.userInfo &&
      <View>
        <AlertView message={search.error} />
        <View style={{...styles.button}, {marginTop: 50} } >
          <LinearButton text='Buscar' textLoading="Buscando..." on={search.searching} styles={{marginTop: 0}} onPress={findCrm} />
        </View>
      </View>
    )
    
    const loginHandle = (password) => {
      if ( password.length == 0 ) {
        Alert.alert('Ops!', 'Informe sua senha para continuar', [
            {text: 'Okay'}
        ]);
        return;
      }

      setData({...data, logging: true});
      setTimeout(async() => {
        const foundUser = Users.filter( item => {
          return data.crm == item.crm && data.uf == item.uf && password == item.password;
        });
        signIn(foundUser);
      }, 2000);
    }

    return (
      
      <View style={styles.container}>
          <StatusBar backgroundColor={Colors.BACKGROUND_SEC} barStyle="light-content"/>
        <View style={styles.header}>
          <Text style={styles.text_header}>{search.title}</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}>
            

            {search.userInfo &&

              <View>
                <View style={styles.action}>
                  <FontAwesome 
                      name="user-o"
                      color={Colors.ICON_GREEN}
                      size={20} />
                  <Text style={[styles.text_footer, {flex: 1, marginLeft: 10}]}>
                    {search.userInfo.name}
                  </Text>  
                  <Animatable.View
                    animation="bounceIn">
                      <Feather 
                        name="check-circle"
                        color={Colors.ICON_GREEN}
                        size={20}
                    />
                  </Animatable.View>
                </View>
                <View style={styles.action}>
                    <Text style={[styles.text_footer, {marginLeft: 28}]}>
                      <Text style={{fontWeight: 'bold'}}>CRM:{' '}</Text>
                      {search.userInfo.uf}-{search.userInfo.crm}
                    </Text>  
                </View>
              </View>
                
            }

            {!search.userInfo &&
              <View>
                <Text style={styles.text_footer}>Informe a UF e o número do CRM:</Text>
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
                      style={styles.textInput}
                      keyboardType='numeric'
                      autoCapitalize="none"
                      value={data.crm}
                      onChangeText={(val) => handleInputCrm(val) }/>
                  {data.isValidCRM &&
                    <Animatable.View
                      animation="bounceIn">
                        <Feather 
                          name="check-circle"
                          color={Colors.ICON_GREEN}
                          size={20} />
                    </Animatable.View>
                  }
                </View>
              </View>
            }

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
        marginTop: 5,
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
