import { ApiPromise, WsProvider } from '@polkadot/api'

const WEB_SOCKET = 'ws://localhost:9944'

async function main() {
    queryOffchainStorage();
}

// query off-chain storage, which is tuple struct with 2 field.
async function queryOffchainStorage() {
    const provider = new WsProvider(WEB_SOCKET);
    const api = await ApiPromise.create({ provider: provider, 
        types: { 
            IndexingData: { title:"Text", value: "u64" } 
        } 
    });

    try {
        const key = 'my_pallet::indexing1';
        const respon = await api.rpc.offchain.localStorageGet('PERSISTENT', key);
        const decoded_data = api.createType("IndexingData", respon.unwrap());
        console.log(`offchain sotrage ${key} = `, decoded_data.toJSON());
    } catch (error) {
        console.error('error when query：', error);
    } finally {
        provider.disconnect();
    }
}

main().catch((error) => {
    console.error(error);
    process.exit(-1);
});