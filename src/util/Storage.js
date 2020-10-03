import AsyncStorage from '@react-native-community/async-storage';

export const _BASE = "_USER";

export const AUTH_USER = "USER";
export const AUTH_TOKEN = "TOKEN";
export const AUTH_PRE_FORM = "PRE_FORM";

class Storage {

  removeItem = async(key) => {
    return AsyncStorage.removeItem(key);
  }
  
  setItem = async (key, value) => {
    if(isJson(value)){
      AsyncStorage.setItem(key, JSON.stringify(value));
    } else {
      AsyncStorage.setItem(key, value);
    }
  }

  setItemJson = async (key, value) => {
    const valor = value ? JSON.stringify(value) : null;
    AsyncStorage.setItem(key, valor);
  }
  
  getItem = async (key) => {
    try{
      const resultado = await AsyncStorage.getItem(key);
      if(isJson(resultado)){
        return JSON.parse(resultado);
      } else {
        return resultado;
      }
    } catch(err){
      return null;
    }
    
  }

  getItemJson = async (key) => {
    try{
      const resultado = await AsyncStorage.getItem(key);
      return resultado ? JSON.parse(resultado) : null;
    } catch(err){
      return null;
    }
    
  }

  clear = async() => {
    AsyncStorage.clear();
  }
}

export default new Storage();


export const isJson = (item) => {
  if (item == null) return false;
  item = typeof item !== "string" ? JSON.stringify(item) : item;
  try {
      item = JSON.parse(item);
  } catch (e) {
      return false;
  }
  if (typeof item === "object" && item !== null) {
      return true;
  }
  return false;
}