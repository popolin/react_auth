import {Platform} from 'react-native';
import {PERMISSIONS, RESULTS, request, check} from 'react-native-permissions';


class Permissions {
  
  executeWithGeolocation = (callbackDo, callbackDont) => {
    executeWithPermission(geolocationPermition, callbackDo, callbackDont);
  }  

};

export default new Permissions();


const callBackDontNotDefined = (permission) => {
  console.log(`Callback negative not defined to ${permission}`);
}

const geolocationPermition = Platform.select({
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
}),

requestGeneral = (permissao, callbackDo, callbackDont) => {
  
  request(permissao).then( result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log(
          `Recurso não disponível neste dispositivo: ${permissao}`,
        );
        callbackDont();
        break;
      case RESULTS.DENIED:
        callbackDont();
        break;
      case RESULTS.GRANTED:
        callbackDo();
        break;
      case RESULTS.BLOCKED:
        callbackDont();
        break;
    }
  });
}


const executeWithPermission = (permissao, callbackDo, callbackDont) => {
  check(permissao)
  .then((result) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log(
          `Recurso não disponível neste dispositivo: ${permissao}`,
        );
        callbackDont();
        break;
      case RESULTS.DENIED:
        requestGeneral(permissao, callbackDo, callbackDont);
        break;
      case RESULTS.GRANTED:
        callbackDo();
        break;
      case RESULTS.BLOCKED:
        callbackDont();
        break;
    }
  })
  .catch((error) => {
    console.error(error);
    callbackDont();
  });


}
