import { ApiPromise, WsProvider } from '@polkadot/api'
import { EventRecord } from '@polkadot/types/interfaces/system';

const WEB_SOCKET = 'ws://localhost:9944'

async function main() {
    subscribePalletEvent('poe')
}

// subscribe events from a particular pallet by filtering all system event by event.section
async function subscribePalletEvent(pallet: string) {
    const provider = new WsProvider(WEB_SOCKET);
    const api = await ApiPromise.create({ provider });

    // Subscribe to system events via storage
    api.query.system.events((events: EventRecord[]) => {
        
        // Loop through the Vec<EventRecord>
        events.forEach((record) => {
            const { event, phase } = record;
            const types = event.typeDef;
            if (event.section == pallet){
                console.log(`${event.section} : ${event.method}:: (phase=${phase.toString()})`);
                console.log(`\t${event.meta.docs.toString()}`);
                // Loop through each of the parameters, displaying the type and data
                event.data.forEach((data, index) => {
                    console.log(`\t\t${types[index].type}: ${data.toString()}`);
                });
            }
        });
    });
}

main().catch((error) => {
    console.error(error);
    process.exit(-1);
});