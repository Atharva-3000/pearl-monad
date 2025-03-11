import { Address } from "viem";

export const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "minter", type: "address" },
      { internalType: "address", name: "burner", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "AccessControlBadConfirmation", type: "error" },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "bytes32", name: "neededRole", type: "bytes32" },
    ],
    name: "AccessControlUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "allowance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "balance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "approver", type: "address" }],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "spender", type: "address" }],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "BURNER_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MINTER_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "callerConfirmation", type: "address" },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export const erc20_bytecode: Address =
  "0x608060405234801562000010575f80fd5b5060405162000f5f38038062000f5f8339810160408190526200003391620001d8565b6040518060400160405280600b81526020016a0aee4c2e0e0cac8408aa8960ab1b815250604051806040016040528060048152602001630ae8aa8960e31b8152508160039081620000859190620002ac565b506004620000948282620002ac565b505050620000c97f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6836200010c60201b60201c565b50620000f67f3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a848826200010c565b50620001035f336200010c565b50505062000378565b5f8281526005602090815260408083206001600160a01b038516845290915281205460ff16620001b3575f8381526005602090815260408083206001600160a01b03861684529091529020805460ff191660011790556200016a3390565b6001600160a01b0316826001600160a01b0316847f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a4506001620001b6565b505f5b92915050565b80516001600160a01b0381168114620001d3575f80fd5b919050565b5f8060408385031215620001ea575f80fd5b620001f583620001bc565b91506200020560208401620001bc565b90509250929050565b634e487b7160e01b5f52604160045260245ffd5b600181811c908216806200023757607f821691505b6020821081036200025657634e487b7160e01b5f52602260045260245ffd5b50919050565b601f821115620002a757805f5260205f20601f840160051c81016020851015620002835750805b601f840160051c820191505b81811015620002a4575f81556001016200028f565b50505b505050565b81516001600160401b03811115620002c857620002c86200020e565b620002e081620002d9845462000222565b846200025c565b602080601f83116001811462000316575f8415620002fe5750858301515b5f19600386901b1c1916600185901b17855562000370565b5f85815260208120601f198616915b82811015620003465788860151825594840194600190910190840162000325565b50858210156200036457878501515f19600388901b60f8161c191681555b505060018460011b0185555b505050505050565b610bd980620003865f395ff3fe608060405234801561000f575f80fd5b5060043610610127575f3560e01c806340c10f19116100a9578063a217fddf1161006e578063a217fddf14610289578063a9059cbb14610290578063d5391393146102a3578063d547741f146102ca578063dd62ed3e146102dd575f80fd5b806340c10f191461022057806370a082311461023357806391d148541461025b57806395d89b411461026e5780639dc29fac14610276575f80fd5b8063248a9ca3116100ef578063248a9ca3146101a0578063282c51f3146101c25780632f2ff15d146101e9578063313ce567146101fe57806336568abe1461020d575f80fd5b806301ffc9a71461012b57806306fdde0314610153578063095ea7b31461016857806318160ddd1461017b57806323b872dd1461018d575b5f80fd5b61013e6101393660046109d4565b610315565b60405190151581526020015b60405180910390f35b61015b61034b565b60405161014a9190610a02565b61013e610176366004610a69565b6103db565b6002545b60405190815260200161014a565b61013e61019b366004610a91565b6103f2565b61017f6101ae366004610aca565b5f9081526005602052604090206001015490565b61017f7f3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a84881565b6101fc6101f7366004610ae1565b610415565b005b6040516012815260200161014a565b6101fc61021b366004610ae1565b61043f565b6101fc61022e366004610a69565b610477565b61017f610241366004610b0b565b6001600160a01b03165f9081526020819052604090205490565b61013e610269366004610ae1565b6104ab565b61015b6104d5565b6101fc610284366004610a69565b6104e4565b61017f5f81565b61013e61029e366004610a69565b610518565b61017f7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a681565b6101fc6102d8366004610ae1565b610525565b61017f6102eb366004610b24565b6001600160a01b039182165f90815260016020908152604080832093909416825291909152205490565b5f6001600160e01b03198216637965db0b60e01b148061034557506301ffc9a760e01b6001600160e01b03198316145b92915050565b60606003805461035a90610b4c565b80601f016020809104026020016040519081016040528092919081815260200182805461038690610b4c565b80156103d15780601f106103a8576101008083540402835291602001916103d1565b820191905f5260205f20905b8154815290600101906020018083116103b457829003601f168201915b5050505050905090565b5f336103e8818585610549565b5060019392505050565b5f336103ff858285610556565b61040a8585856105d1565b506001949350505050565b5f8281526005602052604090206001015461042f8161062e565b610439838361063b565b50505050565b6001600160a01b03811633146104685760405163334bd91960e11b815260040160405180910390fd5b61047282826106cc565b505050565b7f9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a66104a18161062e565b6104728383610737565b5f9182526005602090815260408084206001600160a01b0393909316845291905290205460ff1690565b60606004805461035a90610b4c565b7f3c11d16cbaffd01df69ce1c404f6340ee057498f5f00246190ea54220576a84861050e8161062e565b610472838361076f565b5f336103e88185856105d1565b5f8281526005602052604090206001015461053f8161062e565b61043983836106cc565b61047283838360016107a3565b6001600160a01b038381165f908152600160209081526040808320938616835292905220545f1981101561043957818110156105c357604051637dc7a0d960e11b81526001600160a01b038416600482015260248101829052604481018390526064015b60405180910390fd5b61043984848484035f6107a3565b6001600160a01b0383166105fa57604051634b637e8f60e11b81525f60048201526024016105ba565b6001600160a01b0382166106235760405163ec442f0560e01b81525f60048201526024016105ba565b610472838383610875565b610638813361099b565b50565b5f61064683836104ab565b6106c5575f8381526005602090815260408083206001600160a01b03861684529091529020805460ff1916600117905561067d3390565b6001600160a01b0316826001600160a01b0316847f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a4506001610345565b505f610345565b5f6106d783836104ab565b156106c5575f8381526005602090815260408083206001600160a01b0386168085529252808320805460ff1916905551339286917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a4506001610345565b6001600160a01b0382166107605760405163ec442f0560e01b81525f60048201526024016105ba565b61076b5f8383610875565b5050565b6001600160a01b03821661079857604051634b637e8f60e11b81525f60048201526024016105ba565b61076b825f83610875565b6001600160a01b0384166107cc5760405163e602df0560e01b81525f60048201526024016105ba565b6001600160a01b0383166107f557604051634a1406b160e11b81525f60048201526024016105ba565b6001600160a01b038085165f908152600160209081526040808320938716835292905220829055801561043957826001600160a01b0316846001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258460405161086791815260200190565b60405180910390a350505050565b6001600160a01b03831661089f578060025f8282546108949190610b84565b9091555061090f9050565b6001600160a01b0383165f90815260208190526040902054818110156108f15760405163391434e360e21b81526001600160a01b038516600482015260248101829052604481018390526064016105ba565b6001600160a01b0384165f9081526020819052604090209082900390555b6001600160a01b03821661092b57600280548290039055610949565b6001600160a01b0382165f9081526020819052604090208054820190555b816001600160a01b0316836001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161098e91815260200190565b60405180910390a3505050565b6109a582826104ab565b61076b5760405163e2517d3f60e01b81526001600160a01b0382166004820152602481018390526044016105ba565b5f602082840312156109e4575f80fd5b81356001600160e01b0319811681146109fb575f80fd5b9392505050565b5f602080835283518060208501525f5b81811015610a2e57858101830151858201604001528201610a12565b505f604082860101526040601f19601f8301168501019250505092915050565b80356001600160a01b0381168114610a64575f80fd5b919050565b5f8060408385031215610a7a575f80fd5b610a8383610a4e565b946020939093013593505050565b5f805f60608486031215610aa3575f80fd5b610aac84610a4e565b9250610aba60208501610a4e565b9150604084013590509250925092565b5f60208284031215610ada575f80fd5b5035919050565b5f8060408385031215610af2575f80fd5b82359150610b0260208401610a4e565b90509250929050565b5f60208284031215610b1b575f80fd5b6109fb82610a4e565b5f8060408385031215610b35575f80fd5b610b3e83610a4e565b9150610b0260208401610a4e565b600181811c90821680610b6057607f821691505b602082108103610b7e57634e487b7160e01b5f52602260045260245ffd5b50919050565b8082018082111561034557634e487b7160e01b5f52601160045260245ffdfea26469706673582212207fdcd9d6ac3b31e100acb62bb3e94197c5f1c4c55a44fd8ad0d808dd3ea4877964736f6c63430008160033000000000000000000000000fe91c0c0b16b97c2ae70bd9f940bff8164e42282000000000000000000000000fe91c0c0b16b97c2ae70bd9f940bff8164e42282";
