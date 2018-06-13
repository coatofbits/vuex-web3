import web3 from './web3.js'

const state = {
    ethListening: false,
    ethAddress: undefined,
    ethBalance: undefined,
    ethNetworkId: undefined
}

const getters = {
    // We use the window's web3Instance
    getWeb3Instance: state => {
        return window.web3Instance
    },
    getEthListening: state => state.ethListening,
    getEthNetworkId: state => state.ethNetworkId,
    getEthAddress: state => state.ethAddress,
    getEthBalance: state => state.ethBalance
}

const mutations = {
    setEthListening(state, listening) {
        state.ethListening = listening
    },

    setEthNetworkId (state, networkId) {
        state.ethNetworkId = networkId
    },

    setEthAddress (state, address) {
        state.ethAddress = address
    },

    error(state, error) {
        // TODO log
      console.log('Error:', error)
    },

    setEthBalance (state, {address, balance}) {
        state.ethBalance = balance
    }
}
    
const actions = {
    registerWeb3Instance (context) {
        return web3.registerInstance()
            .then(response => {
                window.web3Instance = response
				// Now that we are registered fetch the network ID and the listening
				// state for the instance
				context.dispatch('fetchEthListening')
				context.dispatch('fetchEthNetworkId')
				// Watch for changes in the listening state
				setInterval(function () {
                    if (window.web3Instance) {
                        web3.fetchEthListening(window.web3Instance)
                            .then(response => {
                                if (state.ethNetworkId !== Number(response)) {
                                    // Listening state has changed
                                    context.commit('setEthListening', response)
                                }
                            })
                            .catch(error => context.commit('error', error))
                    }
				}, 500)
				// Watch for changes in the network ID
				setInterval(function () {
                    if (window.web3Instance && state.ethListening) {
                        web3.fetchEthNetworkId(window.web3Instance)
                            .then(response => {
                                if (state.ethNetworkId !== Number(response)) {
                                    // Network ID has changed
                                    context.commit('setEthNetworkId', response)
                                    context.dispatch('fetchEthBalance')
                                }
                            })
                            .catch(error => context.commit('error', error))
                    }
				}, 500)
				// Watch for changes in the selected address
				setInterval(function () {
                    if (window.web3Instance && state.ethListening) {
                        web3.fetchEthAddress(window.web3Instance)
                            .then(response => {
                                if (state.ethAddress !== response) {
                                    // Address has changed
                                    context.commit('setEthAddress', response)
                                    context.dispatch('fetchEthBalance')
                                }
                            })
                            .catch(error => context.commit('error', error))
                    }
				}, 500)
				// Watch for changes in the selected address' balance
				setInterval(function () {
                    if (window.web3Instance && state.ethListening) {
                        web3.fetchEthBalance(window.web3Instance, state.ethAddress)
                            .then(response => {
                                if (state.ethBalance !== response.balance) {
                                    // Balance has changed
                                    context.commit('setEthBalance', response)
                                }
                            })
                            .catch(error => context.commit('error', error))
                    }
				}, 500)
			})
			.catch(error => {
				if (error.toString() === 'Error: No provider') {
					// There is no provider so no web3.  We commit the mainnet
					// network ID and nothing else
					context.commit('setEthNetworkId', 1)
				} else {
					// Some other error; pass it along
					context.commit('error', error)
				}
			})
	},
	fetchEthListening (context) {
		return web3.fetchEthListening(window.web3Instance)
			.then(response => context.commit('setEthListening', response))
			.catch(error => context.commit('error', error))
	},
	fetchEthNetworkId (context) {
		return web3.fetchEthNetworkId(window.web3Instance)
			.then(response => context.commit('setEthNetworkId', response))
			.catch(error => context.commit('error', error))
	},
	fetchEthAddress (context) {
		return web3.fetchEthAddress(window.web3Instance)
			.then(response => {
				context.commit('setEthAddress', response)
				context.dispatch('fetchEthBalance')
			})
			.catch(error => context.commit('error', error))
	},
	fetchEthBalance (context) {
		return web3.fetchEthBalance(window.web3Instance, state.ethAddress)
			.then(response => context.commit('setEthBalance', response))
			.catch(error => context.commit('error', error))
	}
}

export default {
	getters,
	state,
	mutations,
	actions
}
