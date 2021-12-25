import cassandra from 'cassandra-driver';
import HostnameResolver from "./HostnameResolver";
import logger from "./Logger";

export interface CassandraParams {
    host: string,
    user: string,
    pass: string,
    keyspace: string,
    localDataCenter: string,
    consistency?: cassandra.types.consistencies,
}

export class Cassandra {
    static _instances = [];

    static auth = cassandra.auth;
    static metadata = cassandra.metadata;
    static policies = cassandra.policies;
    static types = cassandra.types;

    static getInstance(config: Partial<CassandraParams>) {
        if (!config || !config.host || !config.user || !config.pass || !config.keyspace || !config.localDataCenter) {
            throw new Error('config is invalid');
        }

        // @ts-ignore
        if (Cassandra._instances[JSON.stringify(config)]) {
            // @ts-ignore
            return Cassandra._instances[JSON.stringify(config)];
        }

        const authProvider = new cassandra.auth.PlainTextAuthProvider(
            config.user,
            config.pass
        );

        const client = new cassandra.Client({
            contactPoints: HostnameResolver.resolve(config.host),
            keyspace: config.keyspace,
            authProvider,
            localDataCenter: 'dc1',
            queryOptions: {
                consistency: config.consistency || cassandra.types.consistencies.quorum
            },
        })
        // For logging
        client.on('log', (level, className, message)=>{
            if (level === 'warn') {
                logger.warn({warn: `${className}: ${message}`});
            } else if (level === 'error') {
                logger.error({error: `${className}: ${message}`});
            }
        });

        // @ts-ignore
        Cassandra._instances[JSON.stringify(config)] = client;
        // @ts-ignore
        return Cassandra._instances[JSON.stringify(config)];
    }
}

export default Cassandra;