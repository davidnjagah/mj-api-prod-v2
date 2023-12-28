"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultIFSConfig = exports.DefaultMJConfig = exports.IFSBot = exports.NijiBot = exports.MJBot = void 0;
// @ts-ignore
var WebSocket = require("isomorphic-ws");
exports.MJBot = "936929561302675456";
exports.NijiBot = "1022952195194359889";
exports.IFSBot = "1090660574196674713";
exports.DefaultMJConfig = {
    BotId: exports.MJBot,
    ChannelId: "1077800642086703114",
    SalaiToken: "",
    ApiInterval: 350,
    SessionId: "8bb7f5b79c7a49f7d0824ab4b8773a81",
    Debug: false,
    Limit: 50,
    Ws: true,
    MaxWait: 200,
    ImageProxy: "",
    DiscordBaseUrl: "https://discord.com",
    WsBaseUrl: "wss://gateway.discord.gg/?encoding=json&v=9",
    fetch: fetch,
    WebSocket: WebSocket,
};
exports.DefaultIFSConfig = {
    BotId: exports.IFSBot,
    ChannelId: "1183359810947784748",
    SalaiToken: "",
    ApiInterval: 350,
    SessionId: "8bb7f5b79c7a49f7d0824ab4b8773a81",
    Debug: false,
    Limit: 50,
    Ws: true,
    MaxWait: 200,
    ImageProxy: "",
    DiscordBaseUrl: "https://discord.com",
    WsBaseUrl: "wss://gateway.discord.gg/?encoding=json&v=9",
    fetch: fetch,
    WebSocket: WebSocket,
};
