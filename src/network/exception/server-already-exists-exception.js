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

module.exports = ServerAlreadyExistsException;
