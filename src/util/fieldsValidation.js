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
      minimum: 14,
      maximum: 15,
      message: "^Número incompleto"
    }
  },
  anexo: {
    presence: {
      allowEmpty: false,
      message: "^Anexe uma imagem"
    },
  }
}