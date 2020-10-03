
import { Alert } from 'react-native';
import validatejs from 'validate.js'
import {validationDictionary} from './fieldsValidation'

export function validateAndAlert(
  fieldName, value) {
    return validate(fieldName, value, onErrorAlert);
}  

export function validate(
  fieldName, value, 
  onError = (msg) => onErrorDefault(msg)) {

  var formValues = {}
  formValues[fieldName] = value
  var formFields = {}
  formFields[fieldName] = validationDictionary[fieldName]

  const result = validatejs(formValues, formFields)

  if (result) {
    const message = result[fieldName][0];
    onError(message, fieldName, value);
    return message;
  }
  return null;
}

const onErrorDefault = () => {
}

const onErrorAlert = (msg) => {
  Alert.alert('Ops...', msg, [
    {text: 'Okay'}
  ]);
}