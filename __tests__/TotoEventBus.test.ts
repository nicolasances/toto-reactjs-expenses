import { Bus, EVENTS, TotoEvent } from '@/utils/TotoEventBus';

describe('TotoEventBus', () => {

    it('delivers a published event to every subscriber of that event', () => {

        const bus = new Bus();
        const received: TotoEvent[] = [];

        bus.subscribeToEvent(EVENTS.expenseCreated, (e) => received.push(e));
        bus.subscribeToEvent(EVENTS.expenseCreated, (e) => received.push(e));

        bus.publishEvent({ name: EVENTS.expenseCreated, context: { id: '1' } });

        expect(received).toHaveLength(2);
    });

    it('does not deliver events to subscribers of other events', () => {

        const bus = new Bus();
        const received: TotoEvent[] = [];

        bus.subscribeToEvent(EVENTS.expenseDeleted, (e) => received.push(e));

        bus.publishEvent({ name: EVENTS.expenseCreated });

        expect(received).toHaveLength(0);
    });

    it('stops delivering events after unsubscribing', () => {

        const bus = new Bus();
        const received: TotoEvent[] = [];
        const callback = (e: TotoEvent) => received.push(e);

        bus.subscribeToEvent(EVENTS.settingsUpdated, callback);
        bus.unsubscribeToEvent(EVENTS.settingsUpdated, callback);

        bus.publishEvent({ name: EVENTS.settingsUpdated });

        expect(received).toHaveLength(0);
    });

    it('ignores publishing an event nobody subscribed to', () => {

        const bus = new Bus();

        expect(() => bus.publishEvent({ name: EVENTS.demoFinished })).not.toThrow();
    });
});
