(function() {

  'use strict';

  ////////////////
  // Define model:
  ////////////////
  var LocalStorageModel = function() {
  	// Define key for localStorage:
    //=============================
  	this.storageKey = 'my-message';
  };

  //======================
  // Add model properties:
  //======================
  LocalStorageModel.prototype = {

  	message : 'There is nothing here to see.',

    // Get data from localStorage:
    //============================
    getData: function() {
      var data = localStorage.getItem(this.storageKey);
      if (data) {
        return JSON.parse(data)[0].message
      } else {
        // If nothing, return this:
        console.log(this.message);
        return this.message;
      }
    },
    // Set localStorage to input value:
    //=================================
    setData: function(value) {
      if (!value) return;
      localStorage.setItem(this.storageKey, ('[{"message":"' + value + '"}]'));
    }
  };

  ////////////////////
  // Define Mediators:
  ////////////////////

  //========================================
  // Mediator to handle events and elements:
  //========================================
  var MessageMediator = function(target, template, dispatcher, model) {

    // Define event to show message:
    //==============================
    dispatcher.addEventListener('show-message', function(event) {

      // Update element's text with data:
      //=================================
      target.firstElementChild.innerHTML = model.getData();
      if (event.params) {
      	console.log('Data passed to the event: ' + event.params.message);
      }
      // If nothing, return:
      return;
    });
  };

  //===========================================
  // Mediator to store message in localStorage:
  //===========================================
  var LocalStorageMediator = function(target, dispatcher, model) {

    // Define event to store submited message.
    // Attach eventHandler to submit button:
    //========================================
    target.addEventListener('click', function(event) {

      // Get value of input:
      //====================
      var value = document.querySelector('input').value;

      // If there's a message, put it in localStorage:
      //==============================================
      if (value) {
        model.setData(value);
        dispatcher.dispatch('show-message', {"message": value});
        document.querySelector('input').value = '';
      }
      // If nothing, return:
      return;
    });
  };


  /////////////////
  // Define module:
  /////////////////
  var Application = soma.Application.extend({

  	//=======================
  	// Initialize the module:
  	//=======================
    init: function() {
      this.injector.mapClass('model', LocalStorageModel, true);
      this.mediators.create(MessageMediator, document.getElementById('message'));
      this.mediators.create(LocalStorageMediator, document.getElementById('submitData'));
    },

  	//==========================
    // On start, dispatch event:
  	//==========================
    start: function() {
      // Send event to show message:
      //============================
      this.dispatcher.dispatch('show-message');
    }
  });


  //===========================
  // Create instance of module:
  //===========================
  var app = new Application();

})();