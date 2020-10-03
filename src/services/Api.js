
import axios from 'axios'
import Toast from 'react-native-simple-toast';
import Locations from '../util/Locations';

const apiCrm = axios.create({baseURL: 'http://localhost:3001/api'})
export default apiCrm;

export async function findAddressByCurrentLatLng(callback){
  Locations.onCurrentLocation((lat, lng, error) => {
    if (error){
      console.error("Api.findAddressByCurrentLatLng", error);
    } else {
      findAddressByLatLng(lat, lng).then(localizacao => {
        callback(localizacao);
      }).catch( error => {
        Toast.show("Não foi possível buscar sua localização", Toast.LONG);
      });
    }
  });
}

export async function findAddressByLatLng(lat, lng){
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  var resposta = await axios.get(url);
  if(resposta.data.error){
    return {error: resposta.data.error}
  } else {
    const {city, city_district, road, state} = resposta.data.address
    return {
      uf: state,
      sigla_uf: Locations.idByDescription(state),
      cidade: city || city_district,
      rua: road,
    }
  }
}

