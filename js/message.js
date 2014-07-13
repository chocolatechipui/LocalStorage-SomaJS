(function() {

  'use strict';

  ///////////////////
  // Define Template:
  ///////////////////
  var Template = function( scope, template, model, dispatcher ) {
    // If no localStorage, output default message:
    //============================================
    scope.message = "Default message here.";
    template.render();
    // Add eventListener for "show-message".
    // This will retrieve the data from localStorage,
    // and reload the template:
    //===============================================
    dispatcher.addEventListener('show-message', function(event) {
      if (model.getData()) {
        scope.message = model.getData();
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

  	message : 'There is nothing here to see.',

    // Get data from localStorage:
    //============================
    getData: function() {
      var data = localStorage.getItem(this.storageKey);
      if (data) {
        // Parse the string data:
        return JSON.parse(data)[0].message
      } else {
        // If nothing, return this:
        return this.message;
      }
    },
    // Set localStorage to input value:
    //=================================
    setData: function(value) {
      // If no value, do nothing:
      if (!value) return;

      // Otherwise set the data to localStorage:
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
      this.createTemplate(Template, document.getElementById('message'));
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