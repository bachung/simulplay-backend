const net = require('net');
const HandlerAlreadyExistsException =
    require('./handler-already-exists-exception');
const ServerAlreadyExistsException =
    require('./server-already-exists-exception');
const SocketWrapper = require('./socket-write-wrapper');

let manager;

/**
 * A class to manage network operations.
 */
class NetworkManager {
    /**
    * Constructs a network manager.
    *
    * @param {object} server - a factory that creates a server
    */
    constructor(server = (new net.Server())) {
        if (manager) return manager;

        this.handlers = {};
        this.socketToUser = new Map();
        this.userToSocket = {};
        this.server = server;
        manager = this;
    }


  /**
   * listen - starts listening on the given port
   *
   * @param  {number} port - the port to listen on
   *
   * @return {Promise} a promise that resolves on listen an rejects on error
   */
    listen(port) {
    if (this.server.listening) {
        throw new ServerAlreadyExistsException('Server already exists');
    }

    this.server.on('connection', (socket) => {
        console.log('Socket created');

        let dataHandler = (data) => {
            let dataAsJSON = JSON.parse(data);

            if (!dataAsJSON.type || !dataAsJSON.data) return;
            if (!this.handlers[dataAsJSON.type]) return;
            if (!this.socketToUser.has(socket)) return;

            this.handlers[dataAsJSON.type](this.socketToUser.get(socket),
              dataAsJSON.data, new SocketWrapper(socket));
          };

          socket.on('data', (data) => {
            if (dataAsJSON.type !== 'register') return;
            if (!dataAsJSON.data || !dataAsJSON.data.username) return;

            this.userToSocket[dataAsJSON.data.username] = socket;
            this.socketToUser.set(socket, dataAsJSON.data.username);
            socket.off('data');
            socket.on('data', dataHandler);
          });
    });

    this.server.listen(port);

    return new Promise((resolve, reject) => {
      this.server.on('listening', resolve);
      this.server.on('error', reject);
    });
  }

  /**
   * on - description
   *
   * @param  {string} type - description
   * @param  {function} handler - description
   */
   on(type, handler) {
       if (this.handlers[type]) {
           throw new HandlerAlreadyExistsException('Handler already exists for '
            + type);
        }
        this.handlers[type] = handler;
    }
};

module.exports = NetworkManager;
