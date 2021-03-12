function encodeQueryData(data) {
   const ret = [];
   for (let d in data)
     ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
   return ret.join('&');
};

class Route {
    /* params will be a Map */
    constructor (method, path) {
        this.base = "https://discord.com/api/v8";
        this.path = path;
        this.method = method;
        this.url = this.base + this.path;
    }

    get base() {
        return "https://discord.com/api/v8";
    }
};

module.exports = Route;