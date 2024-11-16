import app from './app';
import http from 'http';
import { AddressInfo } from 'net';

const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(
        `Server running at http://localhost:${
            (server.address() as AddressInfo).port
        }`
    );
});
