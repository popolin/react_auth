import AsyncStorage from '@react-native-community/async-storage';

export const USER = "_USER"

const isJson = (item) => {
  if (item == null) return false;
  item = typeof item !== "string"
      ? JSON.stringify(item)
      : item;

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

export const removeStore = (key, callback = (error)=>{}) => {
  try {
    AsyncStorage.removeItem(key).then(callback());
  }
  catch(err) {
    callback(err);
  }
}

export const asyncStore = (key, value, callback = (err)=>{}) => {
  try{
    if(isJson(value)){
      AsyncStorage.setItem(key, JSON.stringify(value)).then(callback());
    } else {
      AsyncStorage.setItem(key, value).then(callback());
    }
  }catch(err){
    callback(err);
  }
}

export const recoverStore = (key, callback) => {
  try{
    AsyncStorage.getItem(key).then(result =>{
      if(isJson(result)){
        callback(JSON.parse(result));
      } else {
        callback(result);
      }
    });
  } catch(err){
    callback(null, err)
  }
}