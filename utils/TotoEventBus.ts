/**
 * Names of the events that can be published on the bus.
 */
export const EVENTS = {
    userInfoChanged: 'userInfoChanged',         // User info received from Google
    expenseCreated: 'expenseCreated',           // An expense has been created
    expenseDeleted: 'expenseDeleted',           // An expense has been deleted
    expenseUpdated: 'expenseUpdated',           // An expense has been updated
    settingsUpdated: 'settingsUpdated',         // The settings have been updated
    appSettingsUpdated: 'appSettingsUpdated',   // The app settings have been updated
    demoFinished: 'demoFinished',               // The demo is finished
} as const;

export type EventName = typeof EVENTS[keyof typeof EVENTS];

/**
 * An event published on the bus.
 */
export interface TotoEvent {
    name: EventName;        // The name of the event
    context?: any;          // Whatever the listeners need to process the event
}

export type TotoEventCallback = (event: TotoEvent) => void;

/**
 * Simple in-memory publish/subscribe event bus.
 */
export class Bus {

    private subscribers = new Map<EventName, TotoEventCallback[]>();

    /**
     * Registers a listener to a specific event.
     *
     * @param {EventName} eventName - the name of the event
     * @param {TotoEventCallback} callback - the function that will receive the event
     */
    subscribeToEvent(eventName: EventName, callback: TotoEventCallback): void {

        if (!this.subscribers.has(eventName)) this.subscribers.set(eventName, []);

        this.subscribers.get(eventName)!.push(callback);
    }

    /**
     * Removes a listener from a specific event.
     *
     * @param {EventName} eventName - the name of the event
     * @param {TotoEventCallback} callback - the same function instance that was subscribed
     */
    unsubscribeToEvent(eventName: EventName, callback: TotoEventCallback): void {

        const callbacks = this.subscribers.get(eventName);

        if (!callbacks) return;

        const index = callbacks.indexOf(callback);

        if (index >= 0) callbacks.splice(index, 1);
    }

    /**
     * Publishes an event and triggers the callbacks of its listeners.
     *
     * @param {TotoEvent} event - the event to publish
     */
    publishEvent(event: TotoEvent): void {

        const callbacks = this.subscribers.get(event.name);

        if (!callbacks) return;

        for (const callback of [...callbacks]) callback(event);
    }
}

// The app-wide singleton event bus
export const bus = new Bus();
