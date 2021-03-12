const {parseSnowflake, parseAssetSize} = require('../util/Util');
const Channel = require('../structures/Channel');

class User {
    constructor(client, user_id) {
        this.dmChannel = null;
        this.client = client;
        this.input_id = user_id;
        const data = client.http.getUserInformation(user_id);

        this.id = data['id'];
        this.name = data['username'];
        this.mention = `<@!${user_id}>`;
        this.discriminator = data['discriminator'];
        this.avatarHash = data['avatar'];
        this.avatarAnimated = this.avatarHash.startsWith("a_");
        const defaultFormat = this.avatarAnimated ? "gif" : "png";
        this.avatarUrl = `https://cdn.discordapp.com/avatars/${this.id}/${this.avatarHash}.${defaultFormat}`;

        this.bot = data['bot'];
        this.tag = `${this.name}#${this.discriminator}`;
        this.createdAt = Util.parseSnowflake(this.id);
        this.flagValue = data['flags'];
        this.premiumType = data['premium_type'];
        this.publicFlagValue = data['public_flags'];
    }
    toString() {
        return this.tag;
    }
    avatarUrlAs(options = {}) {
        let url = `https://cdn.discordapp.com/avatars/${this.id}/${this.avatarHash}`
        let validFormats = ['png', 'jpg', 'jpeg', 'webp', 'gif'];

        if (
            options.format &&
            typeof options.format === 'string' &&
            validFormats.includes(options.format.toLowerCase())
        ) {
            let format = options.format;
            if (!this.avatarAnimated && options.format.toLowerCase() === 'gif')
                format = (options.fallback &&
                validFormats.includes(options.fallback.toLowerCase()))
                    ? options.fallback.toLowerCase()
                    : 'webp'
            url += `.${format}`
        }
        else url += '.webp'

        if (
            options.size &&
            parseAssetSize(options.size)
        ) url += `?size=${options.size}`

        return url;
    }

    openDM() {
        const channelData = this.client.http.openUserDM();
        this.dmChannel = new Channel(this.client, channelData['id'], this);
    }
    
    send(...args) {
        if (!this.dmChannel) {
            this.openDM();
        }
        this.dmChannel.send(...args);
    }
}

module.exports = User;