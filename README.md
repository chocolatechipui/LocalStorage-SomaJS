LocalStorage-SomaJS
===================

A basic example setting up a Soma.js module with model,dependency injection, mediators and event dispatchers (pub/sub).


This is an example of a basic setting for a module with Soma.js. It defines a module, injects dependencies, defines a model, mediators, dispatchers. 

The model gets injected in the module, exposing its properties. The model defines two methods for getting and setting the data held in localStorage.

Two mediators are defined: one to get data from the browser's localStorage, the other to put data in localStorage. The first mediator listens for the 'show-message' event. When it hears the event, it updates the target element in the document with the value returned by the model's `getData` method. It also logs the parameters of the event, if there were any.

The second mediator attaches and event listener to the submit button. The event handler takes the value of the text input and invokes the model's `setData` method to put it in localStorage. Then it sends the value as a parameter with the 'show-event'. When this happens, the event listener of the first mediator executes the model's `getData` method and updates the page element with the new value.


The module is defined with the soma.Application.extend method. In the `init` method we use the injector to inject the model. We also initialize the mediators we defined. Because the mediators define dispatchers, then get initialized at the same time. In the module's `start` method we exectute a dispatcher to publish the 'show-message` event. This will cause the event listener of the first mediator to attempt loading data from localStorage.

When we create a new instance of our module, everything gets executed:

```
var app = new Application();
```

You can find out more about Soma.js here [http://somajs.github.io/somajs/site/](http://somajs.github.io/somajs/site/)