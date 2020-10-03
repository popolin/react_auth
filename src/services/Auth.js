import Users from '../models/users';

export function signIn(uf, crm, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const foundUsers = Users.filter( item => {
        return uf == item.uf && crm == item.crm && password == item.password;
      })
      if(foundUsers.length > 0){
        resolve({
          user: foundUsers[0],
          token: 'jk12h3j21h3jk212h3jk12h3jkh12j3kh12k123hh21g3f12f3'
        });
      } else {
        reject({
          error: "Senha inválida"
        })
      }
    }, 2000);
  });
}

export function preSignIn(uf, crm) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const foundUsers = Users.filter( item => {
        return uf == item.uf && crm == item.crm;
      });
      if(foundUsers.length > 0){
        resolve({user: foundUsers[0]});
      } else {
        resolve({
          error: `CRM '${uf}-${crm}' não encontrado`
        })
      }
    }, 2000);
  });
}

export function signUp(data){
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(data);
      resolve({error: 'Não deu certo o cadastro.'})
    }, 2000);
  });

}

