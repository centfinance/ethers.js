"use strict";
import { defineReadOnly } from "@ethersproject/properties";
import { WebSocketProvider } from "./websocket-provider";
import { showThrottleMessage } from "./formatter";
import { Logger } from "@ethersproject/logger";
import { version } from "./_version";
const logger = new Logger(version);
import { UrlJsonRpcProvider } from "./url-json-rpc-provider";
const defaultProjectId = "84842078b09946638c03157f83405213";
export class QuiknodeWebSocketProvider extends WebSocketProvider {
    constructor(network, apiKey) {
        const provider = new QuiknodeProvider(network, apiKey);
        const connection = provider.connection;
        if (connection.password) {
            logger.throwError("QUIKNODE WebSocket project secrets unsupported", Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "QuiknodeProvider.getWebSocketProvider()"
            });
        }
        const url = connection.url.replace(/^http/i, "ws").replace("/v3/", "/ws/v3/");
        super(url, network);
        defineReadOnly(this, "apiKey", provider.projectId);
        defineReadOnly(this, "projectId", provider.projectId);
        defineReadOnly(this, "projectSecret", provider.projectSecret);
    }
    isCommunityResource() {
        return (this.projectId === defaultProjectId);
    }
}
export class QuiknodeProvider extends UrlJsonRpcProvider {
    static getWebSocketProvider(network, apiKey) {
        return new QuiknodeWebSocketProvider(network, apiKey);
    }
    static getApiKey(apiKey) {
        const apiKeyObj = {
            apiKey: defaultProjectId,
            projectId: defaultProjectId,
            projectSecret: null
        };
        if (apiKey == null) {
            return apiKeyObj;
        }
        if (typeof (apiKey) === "string") {
            apiKeyObj.projectId = apiKey;
        }
        else if (apiKey.projectSecret != null) {
            logger.assertArgument((typeof (apiKey.projectId) === "string"), "projectSecret requires a projectId", "projectId", apiKey.projectId);
            logger.assertArgument((typeof (apiKey.projectSecret) === "string"), "invalid projectSecret", "projectSecret", "[REDACTED]");
            apiKeyObj.projectId = apiKey.projectId;
            apiKeyObj.projectSecret = apiKey.projectSecret;
        }
        else if (apiKey.projectId) {
            apiKeyObj.projectId = apiKey.projectId;
        }
        apiKeyObj.apiKey = apiKeyObj.projectId;
        return apiKeyObj;
    }
    static getUrl(network, apiKey) {
        let host = null;
        switch (network ? network.name : "unknown") {
            case "xdai":
                host = "spring-hidden-river.xdai.quiknode.pro";
                break;
            default:
                logger.throwError("unsupported network", Logger.errors.INVALID_ARGUMENT, {
                    argument: "network",
                    value: network
                });
        }
        const connection = {
            allowGzip: true,
            url: ("https:/" + "/" + host + "/" + apiKey.projectId + "/"),
            throttleCallback: (attempt, url) => {
                if (apiKey.projectId === defaultProjectId) {
                    showThrottleMessage();
                }
                return Promise.resolve(true);
            }
        };
        if (apiKey.projectSecret != null) {
            connection.user = "";
            connection.password = apiKey.projectSecret;
        }
        return connection;
    }
    isCommunityResource() {
        return (this.projectId === defaultProjectId);
    }
}
//# sourceMappingURL=quiknode-provider.js.map