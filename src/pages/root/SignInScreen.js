import React, {useState, useEffect} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    StyleSheet ,
    StatusBar
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import {validate, validateAndAlert} from "../../util/Validation"

import {LinearButton, ClearButton, AlertView, TextErrorView} from '../../components/'

import {useAuth} from '../../context/auth';

import Locations from '../../util/Locations';
import Permissions from '../../util/Permissions';
import {findAddressByCurrentLatLng} from '../../services/Api'
import Colors from '../../config/colors.json'
import rootStyles from '../../assets/styles/root'

const SignInScreen = ({navigation}) => {

  const {preForm, preSignIn, signIn, signOut} = useAuth();
  const estados = Locations.ufs();
  
  const initialData = {
    crm: '',
    password: '',
    uf: '',
    logging: false,
    secureTextEntry: true,
    isValidCRM: null,
    isValidPassword: true,
    searching: false,
    error: null
  };

  const [data, setData] = useState(initialData);
  const clearData = () => {
    setData(initialData);
  };

  useEffect(() => {
    Permissions.executeWithGeolocation(localizacaoLiberada);
  }, []);

  const localizacaoLiberada = () => {
    findAddressByCurrentLatLng((resultado) => {
      if (resultado){
        setData(prevState => ({ ...prevState, uf: resultado.sigla_uf }));
      }
    }) 
  }

  const handleInputCrm = crmS => {
    const crm = crmS.replace(/[^0-9]/g, '')
    const isValidCRM = !validate("crm", crm) && !validate("uf", data.uf);
    setData({...data, crm, isValidCRM});
  }

  const handleSelectUF = uf => {
    const isValidCRM = !validate("crm", data.crm) && !validate("uf", uf);
    setData({...data, uf, isValidCRM});
  }

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val
    });
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
          estados.map( uf => (
            <Picker.Item key={uf.id} label={`${uf.id} - ${uf.description}`} selectedValue={uf.id} value={uf.id} />
          ))
        }
      </Picker>
    )
  }

  const findCrm = () => {
    if(!validateAndAlert('uf', data.uf)){
      if(!validate("crm", data.crm, (isValidCRM) => setData({...data, isValidCRM}))){
        setData({...data, error: null, searching: true })
        preSignIn(data.uf, data.crm).then(error => {
          setData({...data, error, searching: false });    
        });
      }
    }
  }

  const resetForm = async () => {
    await signOut();
    clearData();
    
  }

  const loginHandle = (password) => {
    if(!validate("password", password, (isValidPassword) => {setData({...data, isValidPassword})})){
      setData({...data, error: null, logging: true});
      signIn(preForm.uf, preForm.crm, password).then(error => {
        setData({...data, error, logging: false });    
      });
    }
  }

  const renderReset = () => (
    preForm &&
    <View style={styles.button}>
      <ClearButton text='Limpar os campos' onPress={() => resetForm()} />
    </View>
  )

  const renderLogin = () => {
    if(preForm && preForm.id){
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
          <TextErrorView message={data.isValidPassword} />
          
          <View style={{flexDirection:'row',justifyContent : 'space-between', marginTop: 10, marginBottom: 10}}>
            <TouchableOpacity>
                <Text 
                  onPress={() => {navigation.navigate('ForgotPasswordScreen')}}
                  style={{color: Colors.LINK_TOUCH, left:0}}>Esqueceu a senha?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity>
                <Text 
                  onPress={() => {navigation.navigate('NotMeScreen')}}
                  style={{color: Colors.LINK_TOUCH, right:0}}>
                      Não reconhece esta conta?
                  </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.button}>
            <LinearButton on={data.logging} text='Login' onPress={() => loginHandle( data.password )} />
          </View>
        </View>
      )
    }
    if (preForm && !preForm.id){
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
    !preForm &&
    <View style={{...styles.button}, {marginTop: 50} } >
      <LinearButton text='Buscar' textLoading="Buscando..." on={data.searching} styles={{marginTop: 0}} onPress={findCrm} />
    </View>
  )
  
  return (
    
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.BACKGROUND_SEC} barStyle="light-content"/>
      <View style={styles.header}>
        <Text style={styles.text_header}>
          {preForm ? `Olá, ${preForm.name}!` : 'Bem vindo!'}
        </Text>
      </View>
      <Animatable.View 
          animation="fadeInUpBig"
          style={[styles.footer, {flex: 5}]}>

          {
            data.error &&
            <View style={{marginBottom:30}}>
              <AlertView error={true} message={data.error} />
            </View>
          }
          {preForm &&

            <View>
              <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color={Colors.ICON_GREEN}
                    size={20} />
                <Text style={[styles.text_footer, {flex: 1, marginLeft: 10}]}>
                  {preForm.name}
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
                    {preForm.uf}-{preForm.crm}
                  </Text>  
              </View>
            </View>
              
          }

          {!preForm &&
            <View>
              <Text style={styles.text_footer}>
                Informe a <Text style={{fontWeight: 'bold'}}>UF</Text> e o número do <Text style={{fontWeight: 'bold'}}>CRM</Text>:
              </Text>
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
              <TextErrorView message={data.isValidCRM} />
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
  ...rootStyles
});
