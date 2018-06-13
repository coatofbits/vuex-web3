# vuex-web3

This Vuex module gives access to web3 information and functions.

## Installation

Installation is via `npm`.  To install use

```
npm install --save @coatofbits/vuex-web3
```

Once installed the module needs to be listed as a vuex store.  A simple example of a complete `store/index.js` that imports vuex-web3 is as follows:

```
import Vue from 'vue'
import Vuex from 'vuex'
import web3 from '@coatofbits/vuex-web3'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    web3
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
```

## Initialisation

The vuex-web3 module needs to be initialised to connect to the local provider and obtain data.  To do so include the following in your primary Vue component:

```
export default {
  mounted: function () {
    // Fetch the Web3 instance
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.$store.dispatch('fetchWeb3Instance')
      }, 100)
    })
  }
}
```

## Use

Once initialised the following getters are made available:

  - getWeb3Instance: an instance of the `web3` provider used to obtain the information
  - getEthIsListening: a binary value that states if the provider is listening to the Ethereum network.  If `false` then this provider should be considered disconnected and not available for use
  - getEthNetworkId: the numerical network ID of the Ethereum network to which the provider is connected.  Current values include:
    - 1 mainnet
    - 3 ropsten
    - 4 rinkeby
    - 43 kovan
  - getEthAddress: the Ethereum address of the user-selected account
  - getEthBalance: the balance of the Ethereum address of the user-selected account, in Wei

For example, the following component is a complete example of how to obtain and use the current balance:

```
<template>
  <span>
    {{ formatPrice(ethBalance) }}
  </span>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: mapGetters({
    web3Instance: 'getWeb3Instance',
    ethBalance: 'getEthBalance'
  }),
  methods: {
    formatPrice (value) {
      return value && value !== 0 ? web3Instance.utils.fromWei(value, 'ether') + ' ether' : '-'
    }
  }
}
</script>
```

## Reacting to changes

All variables that can be obtained can also be watched for changes.  An example of a watcher for the `ethListening` and `ethAddress` getters suitable for insertion in to a component is shown below:

```
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      ethListening: 'getEthListening',
      ethAddress: 'getEthAddress'
    })
  },
  watch: {
    ethListening: function (listening) {
      if (listening) {
        console.log('listening')
      } else {
        console.log('not listening')
      }
    },
    ethAddress: function (address) {
      console.log('Ethereum address is now ', address)
    }
}
```
