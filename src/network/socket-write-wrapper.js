/**
 * A class that wraps sockets, only allowing the writing of properly formatted
 * data
 * @type {SocketWriteWrapper}
 */
class SocketWriteWrapper {
    /**
     * Constructs a wrapper around the given socket.
     * @param  {net.Socket} socket the socket to wrap
     */
    constructor(socket) {
        const socket = socket;

        this.send = (type, data) => {
            socket.write(JSON.stringify({
                type: type,
                data: data,
            }));
        };
    }
}

module.exports = SocketWriteWrapper;
