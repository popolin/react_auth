import Geolocation from '@react-native-community/geolocation';

class Locations {

  findByDescription = (description) => {
    return this.ufs().find(uf => description == uf.description);
  }

  idByDescription = (description) => {
    const uf = this.findByDescription(description);
    return uf ? uf.id : null;
  }

  onCurrentLocation = (callback) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const lat =
          JSON.stringify(position.coords.latitude);
        const lng =
          JSON.stringify(position.coords.longitude);
        callback(lat, lng);
       }, (error) => callback(0, 0, error), { 
         enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 
       }
    );
  }

  ufs = () => {
    return [
      {id: "AC", description: "Acre" }, 
      {id: "AL", description: "Alagoas" }, 
      {id: "AM", description: "Amazonas" }, 
      {id: "AP", description: "Amapá" }, 
      {id: "BA", description: "Bahia" }, 
      {id: "CE", description: "Ceará" }, 
      {id: "DF", description: "Distrito Federal" }, 
      {id: "ES", description: "Espírito Santo" }, 
      {id: "GO", description: "Goiás" }, 
      {id: "MA", description: "Maranhão" }, 
      {id: "MG", description: "Minas Gerais" }, 
      {id: "MS", description: "Mato Grosso do Sul" }, 
      {id: "MT", description: "Mato Grosso" }, 
      {id: "PA", description: "Pará" }, 
      {id: "PB", description: "Paraíba" }, 
      {id: "PE", description: "Pernambuco" }, 
      {id: "PI", description: "Piauí" }, 
      {id: "PR", description: "Paraná" }, 
      {id: "RJ", description: "Rio de Janeiro" }, 
      {id: "RN", description: "Rio Grande do Norte" }, 
      {id: "RO", description: "Rondônia" }, 
      {id: "RR", description: "Roraima" }, 
      {id: "RS", description: "Rio Grande do Sul" }, 
      {id: "SC", description: "Santa Catarina" }, 
      {id: "SE", description: "Sergipe" }, 
      {id: "SP", description: "São Paulo" }, 
      {id: "TO", description: "Tocantins" }, 
    ]
  }


}

export default new Locations();