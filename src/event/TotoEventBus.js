class Bus {

    constructor() {
      this.subscribers = new Map();
    }
  
      /**
       * Registers a listener to a specific event
       *
       * Requires:
       *
       * - 	eventName	:	the name of the event (see TotoEvents global variable for supported events)
       *
       * -	callback	:	a function(event) that will receive the event
       */
      subscribeToEvent(eventName, callback) {
  
          if (this.subscribers.get(eventName) == null) {
              this.subscribers.set(eventName, []);
          }
  
          this.subscribers.get(eventName).push(callback);
  
      }
  
    /**
     * Unsubscribes to the specified event!!
     */
    unsubscribeToEvent(eventName, callback) {
  
      var callbacks = this.subscribers.get(eventName);
  
      if (callbacks == null) return;
  
      for (var i = 0; i < callbacks.length; i++) {
        if (callbacks[i] == callback) {
          callbacks.splice(i, 1);
          return;
        }
      }
    }
  
      /**
       * Publishes an event on the bus and triggers the listeners callbacks
       *
       * Requires:
       *
       * - event		:	The event to be published. It's an object that must at least contain:
       * 					{ name : the name of the event among those defined in the global variable TotoEvents,
       * 					  context : a generic {} containing whatever is needed by the event listener to process the event
       * 					}
       */
      publishEvent(event) {
  
          var callbacks = this.subscribers.get(event.name);
  
          if (callbacks == null) return;
  
          for (var i = 0; i < callbacks.length; i++) {
              callbacks[i](event);
          }
      }
  
  }
  
  // Export the singleton event bus
  export const bus = new Bus();