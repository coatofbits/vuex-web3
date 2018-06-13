import Web3 from 'web3'

export default {
    // fetchWeb3Instance fetches a new Web3 instance, either from a local provider or from
    // MetaMask or Mist if present
    fetchWeb3Instance() {
        return new Promise(function (resolve, reject) {
            var provider = web3.currentProvider
            if (typeof provider === 'undefined') {
                // Use local provider
                provider = new Web3(new Web3.providers.HttpProvider('https://localhost:8545'))
            } else {
                // Use Mist/MetaMask's provider
                provider = new Web3(provider)
            }
            resolve(provider)
        })
    },

    // fetchEthListening fetches the status of if the given web3 instance is
    // listening for peers.  This is used to understand if the instance is able
    // to obtain updates to state
    fetchEthListening(instance) {
        return new Promise(function (resolve, reject) {
            if (!instance) {
                reject(new Error('No instance'))
            }
            instance.eth.net.isListening((err, listening) => {
                if (err) {
                    // This happens if the provider is disconnected.  Rather
                    // than error we set listening to false
                    resolve(false)
                } else {
                    resolve(listening)
                }
            })
        })
    },

    // fetchEthNetworkId fetches the web3 instance's network ID.  This can be
    // used to understand to which network (mainnet, ropsten, kovan, etc.) it is
    // connected
    fetchEthNetworkId(instance) {
        return new Promise(function (resolve, reject) {
            if (!instance) {
                reject(new Error('No instance'))
            }
            instance.eth.net.getId((err, networkId) => {
                if (err) {
                    reject(new Error('Failed to obtain Eth network ID'))
                } else {
                    resolve(networkId)
                }
            })
        })
    },

    // fetchEthAddress obtains the active address for the web3 instance.  This
    // can be used to check balance, as part of transactions, etc.
    fetchEthAddress(instance) {
        return new Promise(function (resolve, reject) {
            if (!instance) {
                reject(new Error('No instance'))
            }
            instance.eth.getCoinbase((err, address) => {
                if (err) {
                    reject(new Error('Failed to obtain address'))
                } else {
                    resolve(address)
                }
            })
        })
    },

    // fetchEthBalance obtains the balance for the web3 instance and address
    fetchEthBalance(instance, address) {
        return new Promise(function (resolve, reject) {
            if (!instance) {
                reject(new Error('No instance'))
            }
            if (!address) {
                resolve({address, balance: undefined})
            } else {
                instance.eth.getBalance(address, 'pending', (err, balance) => {
                    if (err) {
                        reject(new Error('Failed to obtain balance'))
                    } else {
                        resolve({address, balance})
                    }
                })
            }
        })
    }
}
