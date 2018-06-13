import Web3 from 'web3'

export default {
    registerInstance() {
        return new Promise(function (resolve, reject) {
            var instance = window.web3
            if (typeof instance === 'undefined') {
                // Use local provider
                instance = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
            } else {
                // Use Mist/MetaMask's provider
                instance = new Web3(instance.currentProvider)
            }
            resolve(instance)
        })
    },

    fetchEthListening(instance) {
        return new Promise(function (resolve, reject) {
            if (!instance) {
                reject(new Error('No instance'))
            }
            instance.eth.net.isListening((err, listening) => {
                if (err) {
                    // TODO move to  (false)
                    reject(new Error('Failed to obtain Eth listening status'))
                } else {
                    resolve(listening)
                }
            })
        })
    },

    fetchEthNetworkId(instance) {
        return new Promise(function (resolve, reject) {
            if (!instance) {
                reject(new Error('No instance'))
            }
            instance.eth.net.getId((err, networkId) => {
                if (err) {
                    // TODO move to (false)
                    reject(new Error('Failed to obtain Eth network ID'))
                } else {
                    resolve(networkId)
                }
            })
        })
    },

    fetchEthAddress(instance) {
        return new Promise(function (resolve, reject) {
            if (!instance) {
                reject(new Error('No instance'))
            }
            instance.eth.getCoinbase((err, address) => {
                if (err) {
                    // TODO move to (false)
                    reject(new Error('Failed to obtain address'))
                } else {
                    resolve(address)
                }
            })
        })
    },

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
                        // TODO move to (false)
                        reject(new Error('Failed to obtain balance'))
                    } else {
                        resolve({address, balance})
                    }
                })
            }
        })
    }
}
