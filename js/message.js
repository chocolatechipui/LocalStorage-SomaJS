(function() {

  'use strict';

  ///////////////////
  // Define Template:
  ///////////////////
  var PreviousMessages = function( scope, template, model, dispatcher ) {
    // If no localStorage, output default message:
    //============================================
    // Add eventListener for "show-message".
    // This will retrieve the data from localStorage,
    // and reload the template:
    //===============================================
    dispatcher.addEventListener('show-message', function(event) {
      if (model.getData()) {
        scope.messages = model.getData();
        template.render();
      }
    });
  };

  ///////////////////////////////////
  // Define Current Message Template:
  ///////////////////////////////////
  var CurrentMessage = function(scope, template, model, dispatcher) {
    // Set default message:
    //=====================
    scope.message = "Default message here.";
    template.render();
    // Add event listener:
    //====================
    dispatcher.addEventListener('show-message', function(event) {
      var data = model.getData();
      if (data && data.length) {
        // If localStorage get most recent message:
        //=========================================
        scope.message = data[0].message;
        template.render();
      }
    });
  };

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


    // Get data from localStorage:
    //============================
    getData: function() {
      var data = localStorage.getItem(this.storageKey);
      if (data && data.length) {
        // Parse the string data:
        return JSON.parse(data);
      }
    },
    // Set localStorage to input value:
    //=================================
    setData: function(value) {
      // If no value, do nothing:
      if (!value) return;
      var data = [];
      if (this.getData()) {
        data = this.getData();
        data.unshift({"message": value});
        localStorage.setItem(this.storageKey, JSON.stringify(data));
      } else {
        localStorage.setItem(this.storageKey, '[{"message": "' + value + '"}]');
      }
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
      model.message = model.getData();
      // Just to show how to pass data as event params:
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
        // Call model.setData to store
        // data in localStorage:
        model.setData(value);
        // Dispatch event "show-message" with data as param:
        dispatcher.dispatch('show-message', {"message": value});
        // Set input value to empty:
        document.querySelector('input').value = '';
      }
      // If no
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
      // Inject the model:
      this.injector.mapClass('model', LocalStorageModel, true );
      // Create the mediator MessageMediator 
      // for the message template:
      //=====================================
      this.mediators.create(MessageMediator, document.getElementById('message'));
      // Create the mediator LocalStorageMediator
      // for the submit button:
      //=========================================
      this.mediators.create(LocalStorageMediator, document.getElementById('submitData'));
      // Create the message template:
      //=============================
      this.createTemplate(PreviousMessages, document.getElementById('messages'));
      this.createTemplate(CurrentMessage, document.getElementById('message'));
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