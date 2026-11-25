// Generado desde contracts/artifacts (npx hardhat compile)
export const certiBlockAbi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "nombreInstitucion",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "DatosVacios",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoAutorizado",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "NoExiste",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "YaEmitido",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "YaRevocado",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "huella",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "emisor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "descripcion",
        "type": "string"
      }
    ],
    "name": "CertificadoEmitido",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "bytes32",
        "name": "huella",
        "type": "bytes32"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "emisor",
        "type": "address"
      }
    ],
    "name": "CertificadoRevocado",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "emisor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "nombre",
        "type": "string"
      }
    ],
    "name": "InstitucionActualizada",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "administrador",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "huella",
        "type": "bytes32"
      },
      {
        "internalType": "string",
        "name": "descripcion",
        "type": "string"
      }
    ],
    "name": "emitir",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "institucion",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "huella",
        "type": "bytes32"
      }
    ],
    "name": "revocar",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "emisor",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "nombre",
        "type": "string"
      }
    ],
    "name": "setInstitucion",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalCertificados",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "huella",
        "type": "bytes32"
      }
    ],
    "name": "verificar",
    "outputs": [
      {
        "internalType": "bool",
        "name": "existe",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "valido",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "emisor",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "nombreInstitucion",
        "type": "string"
      },
      {
        "internalType": "uint64",
        "name": "fechaEmision",
        "type": "uint64"
      },
      {
        "internalType": "string",
        "name": "descripcion",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
