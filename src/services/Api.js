
import axios from 'axios'
import Locations from '../util/Locations';

const apiCrm = axios.create({baseURL: 'http://localhost:3001/api'})

class Api {

  findAddressByCurrentLatLng(callback){
    Locations.onCurrentLocation((lat, lng, error) => {
      if (error){
        callback(null, error);
      } else {
        this.findAddressByLatLng(lat, lng).then(localizacao => {
          callback(localizacao);
        });
      }
    });
  }

  async findAddressByLatLng(lat, lng){
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

}

export default new Api();
