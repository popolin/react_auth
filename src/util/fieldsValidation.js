export const validationDictionary = {
  uf: {
    presence: {
      allowEmpty: false,
      message: "^Selecione a UF"
    }
  },
  crm: {
    presence: {
      allowEmpty: false,
      message: "^Informe o CRM"
    },
    length: {
      minimum: 3,
      message: "^CRM deve ter ao menos 3 caracteres"
    }
  },
  password: {
    presence: {
      allowEmpty: false,
      message: "^Informe a senha"
    },
    length: {
      is: 6,
      message: "^A senha deve ter 6 caracteres"
    }
  },
  email: {
    presence: {
      allowEmpty: false,
      message: "^Informe o email"
    },
    email: {
      message: "^Email inválido"
    }
  },
  telefone: {
    presence: {
      allowEmpty: false,
      message: "^Informe seu telefone"
    },
    length: {
      is: 11,
      message: "^Número deve conter 11 dígitos"
    }
  },
}