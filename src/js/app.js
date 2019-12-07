App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../cars.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.car-price').text(data[i].price);
        petTemplate.find('.car-brand').text(data[i].brand);
        petTemplate.find('.car-color').text(data[i].color);
        petTemplate.find('.btn-buy').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
// Modern dapp browsers...
if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
}
// Legacy dapp browsers...
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);


    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Deal.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var DealArtifact = data;
      App.contracts.Deal = TruffleContract(DealArtifact);
    
      // Set the provider for our contract
      App.contracts.Deal.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markDeal();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-buy', App.handleDeal);
  },

  markDeal: function(buyers, account) {
    var dealInstance;

    App.contracts.Deal.deployed().then(function(instance) {
      dealInstance = instance;
    
      return dealInstance.getBuyers.call();
    }).then(function(buyers) {
      for (i = 0; i < buyers.length; i++) {
        if (buyers[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-car').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });
    
  },

  handleDeal: function(event) {
    event.preventDefault();

    var carId = parseInt($(event.target).data('id'));

    var dealInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Deal.deployed().then(function(instance) {
        dealInstance = instance;
    
        // Execute adopt as a transaction by sending account
        return dealInstance.buy(carId, {from: account});
      }).then(function(result) {
        return App.markDeal();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
    
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
