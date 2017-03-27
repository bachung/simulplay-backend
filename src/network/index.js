const net = require('net');

let manager;

/**
 * An exception that signifies that a server already exists.
 */
class ServerAlreadyExistsException {

  /**
   * Constructs a ServerAlreadyExistsException
   *
   * @param {string} message the message for the exception
   */
  constructor(message) {
    this.message = message;
  }
}

/**
 * A handler already exists for this data type.
 */
class HandlerAlreadyExistsException {

  /**
   * Constructs a HandlerAlreadyExistsException
   *
   * @param {string} message the message for the exception
   */
  constructor(message) {
    this.message = message;
  }
}

/**
 * A class to manage network operations.
 */
class NetworkManager {
  /**
   * Constructs a network manager.
   */
  constructor() {
    if (manager) return manager;
    this.handlers = {};
    this.socketToUser = new Map();
    this.userToSocket = {};
    this.server = null;
    manager = this;
  }


  /**
   * listen - starts listening on the given port
   *
   * @param  {number} port the port to listen on
   */
  listen(port) {
    if (this.server) {
      throw new ServerAlreadyExistsException('Server already exists');
    }

    this.server = net.createServer((socket) => {
      console.log('Socket created');

      let dataHandler = (data) => {
        let dataAsJSON = JSON.parse(data);

        if (!dataAsJSON.type || !dataAsJSON.data) return;
        if (!this.handlers[dataAsJSON.type]) return;
        if (!this.socketToUser.has(socket)) return;

        this.handlers[dataAsJSON.type](this.socketToUser.get(socket),
          dataAsJSON.data, this);
      };

      socket.on('data', (data) => {
        if (dataAsJSON.type !== 'register') return;
        if (!dataAsJSON.data || !dataAsJSON.data.username) return;

        this.userToSocket = socket;
        socket.off('data');
        socket.on('data', dataHandler);
      });
    });

    this.server.listen(port);
  }

  /**
   * on - description
   *
   * @param  {string} type    description
   * @param  {function} handler description
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
