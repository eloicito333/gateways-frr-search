const express = require('express')
const app = express()
const Corrosion = require('corrosion');
const dotenv = require('dotenv')

dotenv.config()

const proxy = new Corrosion({
    codec: 'xor', // apply basic xor encryption to url parameters in an effort to evade filters. Optional.
    prefix: '/get/' // specify the endpoint (prefix). Optional.
});

proxy.bundleScripts();

app.get(/\/get\/*/, (req, res) => {
    return proxy.request(req, res);
});

app.post(/\/get\/*/, (req, res) => {
    return proxy.request(req, res);
});

app.on('upgrade', (clientRequest, clientSocket, clientHead) => proxy.upgrade(clientRequest, clientSocket, clientHead));