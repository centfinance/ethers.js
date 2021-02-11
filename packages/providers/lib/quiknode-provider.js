"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var properties_1 = require("@ethersproject/properties");
var websocket_provider_1 = require("./websocket-provider");
var formatter_1 = require("./formatter");
var logger_1 = require("@ethersproject/logger");
var _version_1 = require("./_version");
var logger = new logger_1.Logger(_version_1.version);
var url_json_rpc_provider_1 = require("./url-json-rpc-provider");
var defaultProjectId = "84842078b09946638c03157f83405213";
var QuiknodeWebSocketProvider = /** @class */ (function (_super) {
    __extends(QuiknodeWebSocketProvider, _super);
    function QuiknodeWebSocketProvider(network, apiKey) {
        var _this = this;
        var provider = new QuiknodeProvider(network, apiKey);
        var connection = provider.connection;
        if (connection.password) {
            logger.throwError("QUIKNODE WebSocket project secrets unsupported", logger_1.Logger.errors.UNSUPPORTED_OPERATION, {
                operation: "QuiknodeProvider.getWebSocketProvider()"
            });
        }
        var url = connection.url.replace(/^http/i, "ws").replace("/v3/", "/ws/v3/");
        _this = _super.call(this, url, network) || this;
        properties_1.defineReadOnly(_this, "apiKey", provider.projectId);
        properties_1.defineReadOnly(_this, "projectId", provider.projectId);
        properties_1.defineReadOnly(_this, "projectSecret", provider.projectSecret);
        return _this;
    }
    QuiknodeWebSocketProvider.prototype.isCommunityResource = function () {
        return (this.projectId === defaultProjectId);
    };
    return QuiknodeWebSocketProvider;
}(websocket_provider_1.WebSocketProvider));
exports.QuiknodeWebSocketProvider = QuiknodeWebSocketProvider;
var QuiknodeProvider = /** @class */ (function (_super) {
    __extends(QuiknodeProvider, _super);
    function QuiknodeProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QuiknodeProvider.getWebSocketProvider = function (network, apiKey) {
        return new QuiknodeWebSocketProvider(network, apiKey);
    };
    QuiknodeProvider.getApiKey = function (apiKey) {
        var apiKeyObj = {
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
    };
    QuiknodeProvider.getUrl = function (network, apiKey) {
        var host = null;
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
        var connection = {
            allowGzip: true,
            url: ("https:/" + "/" + host + "/" + apiKey.projectId + "/"),
            throttleCallback: function (attempt, url) {
                if (apiKey.projectId === defaultProjectId) {
                    formatter_1.showThrottleMessage();
                }
                return Promise.resolve(true);
            }
        };
        if (apiKey.projectSecret != null) {
            connection.user = "";
            connection.password = apiKey.projectSecret;
        }
        return connection;
    };
    QuiknodeProvider.prototype.isCommunityResource = function () {
        return (this.projectId === defaultProjectId);
    };
    return QuiknodeProvider;
}(url_json_rpc_provider_1.UrlJsonRpcProvider));
exports.QuiknodeProvider = QuiknodeProvider;
//# sourceMappingURL=quiknode-provider.js.map