import { Network, Networkish } from "@ethersproject/networks";
import { ConnectionInfo } from "@ethersproject/web";
import { WebSocketProvider } from "./websocket-provider";
import { CommunityResourcable } from "./formatter";
import { UrlJsonRpcProvider } from "./url-json-rpc-provider";
export declare class QuiknodeWebSocketProvider extends WebSocketProvider implements CommunityResourcable {
    readonly apiKey: string;
    readonly projectId: string;
    readonly projectSecret: string;
    constructor(network?: Networkish, apiKey?: any);
    isCommunityResource(): boolean;
}
export declare class QuiknodeProvider extends UrlJsonRpcProvider {
    readonly projectId: string;
    readonly projectSecret: string;
    static getWebSocketProvider(network?: Networkish, apiKey?: any): QuiknodeWebSocketProvider;
    static getApiKey(apiKey: any): any;
    static getUrl(network: Network, apiKey: any): ConnectionInfo;
    isCommunityResource(): boolean;
}
