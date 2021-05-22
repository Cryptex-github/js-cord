const Client = require('../../client/Client');
const CommandErrors = require('./Errors');

const botDefaults = { 
    prefix: undefined, 
    prefixCaseInsensitive: false, 
    commandsCaseInsensitive: true, 
    helpCommand: undefined,
    description: undefined
}

module.exports = class Bot extends Client {
    constructor(options) {
        if (typeof options === 'object') {
            for (let [option, value] of Object.items(options)) {
                let clientOptions = {}
                if (!Object.keys(botDefaults).includes(option)) {
                    clientOptions[option] = value;
                }
            }
            this._setupOptions({botDefaults, ...options});
        } else if (typeof options === 'string') {
            this._setupOptions({...botDefaults, prefix: options})
        }
    }

    _setupOptions(opts) {
        with (opts) {
            if (!prefix) 
                throw new CommandErrors.ConstructionError('Prefix is a required option that is missing.');
            if (!(['string', 'function'].includes(typeof prefix) || 
                  prefix instanceof Array)) 
                throw new CommandErrors.ConstructionError('hi');
            this.prefix = prefix;
        }
    }
}
