module.exports = exports = {
    app_version: '1.01',
    app_update: '2020-07-25',
    app_repository: 'github.com/yamachan/awscli-help',
    app_author: 'Toshio Yamashita (@yamachan360)',

    get: function() {
        return [this.app_version, this.app_update, this.app_repository];
    }
}