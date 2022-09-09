const express = require('express')
const app = express()
const Corrosion = require('corrosion');
const dotenv = require('dotenv');

dotenv.config()

const requireHTTPS = (req, res, next) => {
    if (!req.secure && req.get('x-forwarded-proto') !== 'https' && process.env.NODE_ENV !== "development") {
        return res.redirect(`https://${req.get('host')}${req.url}`);
    }
    next();
}

app.use(requireHTTPS)

const proxy = new Corrosion({
    codec: 'xor', // apply basic xor encryption to url parameters in an effort to evade filters. Optional.
    prefix: '/get/', // specify the endpoint (prefix). Optional.
    title: 'Gataway',
    ssl: true
});

proxy.bundleScripts();

app.get(/\/get\/*/, (req, res) => {
    return proxy.request(req, res);
});

app.post(/\/get\/*/, (req, res) => {
    return proxy.request(req, res);
});

app.on('upgrade', (clientRequest, clientSocket, clientHead) => proxy.upgrade(clientRequest, clientSocket, clientHead));

app.listen(process.env.PORT || 8080, () => console.log(`Server running at port: ${process.env.PORT}`))