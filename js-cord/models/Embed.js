const Color = require('./Color');
const File = require('./File');


/**
 * Represents embedded content of a Discord message.
 * You can also construct this class to send your own embeds.
 * @param {?object} data The raw JSON data, usually from Discord, to construct this embed with.
 */
module.exports = class Embed {
    constructor(data) {
        /**
         * The type of this embed. Usually 'rich'.
         * @type {string}
         */
        this.type = 'rich';

        /**
         * The footer for this embed. 
         * @type {?object}
         */
        this.footer = {}

        /**
         * The author for this embed.
         * @type {?object}
         */
        this.author = {}

        /**
         * The thumbnail for this embed.
         * @type {?object}
         */
        this.thumbnail = {}

        /**
         * The large image for this embed.
         * @type {?object}
         */
        this.image = {}
        
        /**
         * The video for this embed.
         * Rich embeds do not have this property.
         * @type {?object}
         */
        this.video = {}
        
        /**
         * The embed's provider.
         * Rich embeds do not have this property.
         * @type {?object}
         */
        this.provider = {}

        /**
         * The fields for this embed.
         * There can be up to 25 of these.
         * @type {?Array<object>}
         */
        this.fields = [];

        this.files = [];
        if (data) this.loadData(data);
    }

    loadData(data) {
        if (data.type) this.type = data.type;

        /**
         * The embed's title.
         * @type {?string}
         */
        this.title = data.title;

        /**
         * The embed's description.
         * @type {?string}
         */
        this.description = data.description;

        /**
         * The title's URL.
         * @type {?string}
         */
        this.url = data.url;

        /**
         * The timestamp shown on the embed.
         * @type {?Date}
         */
        this.timestamp = new Date(Date.parse(data.timestamp));
        
        /**
         * The color of the embed.
         * @type {?Color}
         */
        this.color = new Color(data.color || 0);

        this.fields = data.fields ? data.fields : [];

        if (data.footer) {
            this.footer = {
                text: data.footer.text,
                iconURL: data.footer.icon_url,
                proxyIconURL: data.footer.proxy_icon_url,
                toString() {
                    return data.footer.text
                }
            }
        }

        if (data.author) {
            this.author = {
                name: data.author.name,
                iconURL: data.author.icon_url,
                proxyIconURL: data.author.proxy_icon_url,
                url: data.author.url,
                toString() {
                    return data.author.name
                }
            }
        }

        if (data.thumbnail) {
            this.thumbnail = {
                url: data.thumbnail.url,
                proxyURL: data.thumbnail.proxy_url,
                height: data.thumbnail.height,
                width: data.thumbnail.width,
                toString() {
                    return data.thumbnail.url;
                }
            }
        }

        if (data.image) {
            this.image = {
                url: data.image.url,
                proxyURL: data.image.proxy_url,
                height: data.image.height,
                width: data.image.width,
                toString() {
                    return data.image.url;
                }
            }
        }

        if (data.video) {
            this.video = {
                url: data.video.url,
                proxyURL: data.video.proxy_url,
                height: data.video.height,
                width: data.video.width,
                toString() {
                    return data.video.url;
                }
            }
        }

        if (data.provider) 
            this.provider = data.provider;
    }
    
    /**
     * An alias for {@link Embed#color}.
     */
    get colour() {
        return this.color;
    }

    /**
     * Sets and overwrites the title for this embed.
     * @param {string} title The title text.
     * @param {?string} url The URL that the title leads to.
     */
    setTitle(title, url) {
        this.title = title;
        if (url) this.url = url;
        return this
    } 

    /**
     * Sets and overwrites the description for this embed.
     * @param {string} description The description text. 
     */
    setDescription(description) {
        this.description = description;
        return this
    }

    /**
     * Adds a new line with text to the description.
     * @param {?string} description The text to add to the description.
     */
    appendDescription(description) {
        if (!this.description) 
            this.description = '';
        this.description += '\n' + description;
        return this
    }

    /**
     * Sets the title's URL.
     * @param {string} url The new URL of this embed.
     */
    setURL(url) {
        this.url = url;
        return this
    }

    /**
     * Changes the color of this embed.
     * @param {Color} color The new color of the embed.
     */
    setColor(color) {
        if (typeof color === 'number')
            color = new Color(color);

        else if (typeof color == 'string') {
            let oldColor = color;
            color = Color[color];

            if (!color) color = Color.fromHex(oldColor);
            else { color = color() }
        }

        this.color = color;
        return this
    }

    /**
     * An alias for {@link Embed#setColor}.
     */
    setColour(colour) {
        return this.setColor(colour);
    }

    /**
     * Changes the timestamp shown on this embed.
     * @param {?Date} timestamp The new timestamp for this embed. 
     */
    setTimestamp(timestamp) {
        timestamp = timestamp || new Date(Date.now());
        if (typeof timestamp === 'number')
            timestamp = new Date(timestamp);
        this.timestamp = timestamp;
        return this
    }

    #craftField(name, value, inline = true) {
        if (name instanceof Object) {
            value = name.value;
            inline = name.inline || true;
            name = name.name;
        }

        return {
            name: name,
            value: value,
            inline: inline
        }
    } 

    /**
     * Adds a field to this embed.
     * @param {string} name The name [title] of this field.
     * @param {string} value The value [description] of this field. 
     * @param {?boolean} inline Whether or not this field is inline or not. 
     */
    addField(name, value, inline) {
        this.fields.push(this.#craftField(name, value, inline));
        return this
    }

    /**
     * Removes a field from this embed.
     * @param {number} index The index of the field to remove, starting from 0.
     */
    removeField(index) {
        this.fields.splice(index, 1);
        return this
    }

    /**
     * Overwrites an already existing field.
     * @param {number} index The index of the field to overwrite. 
     * @param {string} name The new name [title] of this field.
     * @param {string} value The new value [description] of this field. 
     * @param {?boolean} inline Whether or not this field is inline or not. 
     */
    setField(index, name, value, inline) {
        this.fields[index] = this.#craftField(name, value, inline);
        return this
    }

    /**
     * Splices the embed fields.
     * @param {number} index The index to start splicing from.
     * @param {number} remove The amount of fields to remove at this index. 
     * @param {string} name The name [title] of this field.
     * @param {string} value The value [description] of this field. 
     * @param {?boolean} inline Whether or not this field is inline or not. 
     */
    spliceField(index, remove, name, value, inline) {
        this.fields.splice(index, remove, this.#craftField(name, value, inline));
        return this
    }

    /**
     * Inserts a new field at the given index.
     * @param {number} index The index to insert the field at.
     * @param {string} name The name [title] of this field.
     * @param {string} value The value [description] of this field. 
     * @param {?boolean} inline Whether or not this field is inline or not. 
     */
    insertField(index, name, value, inline) {
        this.fields.splice(index, 0, this.#craftField(name, value, inline));
        return this
    }

    /**
     * Removes all of the fields in this embed.
     */
    clearFields() {
        this.fields = [];
        return this
    }
    
    /**
     * Pops a field from this embed.
     * @return {?object} The field that was popped.
     */
    popField() {
        return this.fields.pop();
    }

    /**
     * Shifts a field from this embed.
     */
    shiftField() {
        this.fields.shift();
        return this
    }

    /**
     * Swaps a field with another one.
     * @param {number} index The index to swap.
     * @param {number} otherIndex The other index to swap with.
     */
    swapField(index, otherIndex) {
        [this.fields[index], this.fields[otherIndex]] = [this.fields[otherIndex], this.fields[index]];
        return this
    }

    /**
     * Finds a field in this embed based on it's name.
     * @param {string} name The name [title] of the field to find.
     * @returns {?object} The field found, if any.
     */
    findField(name) {
        return this.fields.find(field => field.name == name);
    }

    setFields(fields) {
        this.fields = fields;
        return this
    }

    #buildFooter(text, iconURL) {
        if (text instanceof Object) {
            iconURL = text.iconURL;
            text = text.text;
        }

        return [text, iconURL]
    }

    /**
     * Sets and overwrites the current footer of this embed.
     * @param {string} text The text of the footer.
     * @param {?string} iconURL The icon URL of the footer.
     */
    setFooter(text, iconURL) {
        [ text, iconURL ] = this.#buildFooter(text, iconURL);

        this.footer = {
            text: text || this.footer.text,
            iconURL: iconURL || this.footer.iconURL
        }
        return this
    }

    setFooterText(text) {
        return this.setFooter(text);
    }

    setFooterIconURL(iconURL) {
        return this.setFooter(undefined, iconURL);
    } 

    #buildAuthor(name, iconURL, url) {
        if (name instanceof Object) {
            iconURL = name.iconURL;
            url = name.url;
        } else if (iconURL instanceof Object &&
                   typeof name === 'string') {
            url = iconURL.url;
            iconURL = iconURL.iconURL;
        }

        return [ name, iconURL, url ]
    }

    /**
     * Sets and overwrites thie embed's author.
     * @param {string} name The author text.
     * @param {?string} iconURL The author's icon URL.
     * @param {?string} url The URL the author leads to.
     */
    setAuthor(name, iconURL, url) {
        [ name, iconURL, url ] = this.#buildAuthor(name, iconURL, url);

        this.author = {
            name: name || this.author.name,
            iconURL: iconURL || this.author.iconURL,
            url: url || this.author.url
        }
        return this
    }

    setAuthorName(name) {
        return this.setAuthor(name);
    }

    setAuthorIconURL(iconURL) {
        return this.setAuthor(undefined, iconURL);
    }

    setAuthorURL(url) {
        return this.setAuthor(undefined, undefined, url);
    }

    /**
     * Sets the thumbnail of this embed.
     * @param {?string} url The image URL of the new thumbnail. 
     */
    setThumbnail(url) {
        if (url instanceof File) {
            this.files.push(url);
            url = `attachment://${url.filename}`
        }
        this.thumbnail.url = url;
        return this
    }

    /**
     * Sets the large image of this embed.
     * @param {?string} url The image URL of the new image.
     */
    setImage(url) {
        if (url instanceof File) {
            this.files.push(url);
            url = `attachment://${url.filename}`
        }
        this.image.url = url;
        return this
    }

    /**
     * Turns this embed into a JSON object.
     * Note: This only takes into account rich embeds.
     * @return {object}
     */
    toJSON() {
        return {
            type: this.type || 'rich',
            title: this.title || null,
            description: this.description || null,
            url: this.url || null,
            timestamp: this.timestamp ? this.timestamp.toISOString() : null,
            color: this.color ? this.color.value : null,
            footer: Object.keys(this.footer).length 
                ? {
                    name: this.footer.name || null,
                    icon_url: this.footer.iconURL || null
                } : null,
            author: Object.keys(this.author).length
                ? {
                    name: this.author.name || null,
                    icon_url: this.author.iconURL || null,
                    url: this.author.url || null
                } : null,
            image: this.image ? { url: this.image.url } : null,
            thumbnail: this.thumbnail ? { url: this.thumbnail.url } : null,
            fields: this.fields
        }
    }
}
