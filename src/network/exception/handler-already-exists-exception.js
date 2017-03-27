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

module.exports = HandlerAlreadyExistsException;
