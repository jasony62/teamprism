const crypto = require('crypto')
const { Model } = require('./model')

class Who extends Model {
    /**
     *
     */
    getCookieKey(seed) {
        const md5 = crypto.createHash('md5');
        return md5.update(seed).digest('hex');
    }
    /**
     * 将当前用户的身份保留的在cookie中
     */
    setCookieUser(siteId, user) {
        let cookiekey = this.getCookieKey(siteId);
        let oCookieUser = user;
        oCookieUser = JSON.stringify(oCookieUser);
        let encoded = Model.encryptEnc(oCookieUser, cookiekey);
        let expireAt = new Date() + (86400 * 3650);
        //this.mySetCookie(`_site_${siteId}_fe_user`, encoded, expireAt);

        return true;
    }
    /**
     * 从cookie中获取当前用户信息
     */
    getCookieUser(siteId, encoded) {
        if (!encoded) {
            return false;
        }
        let cookiekey = this.getCookieKey(siteId);
        let oCookieUser = Model.encryptDec(encoded, cookiekey);
        oCookieUser = JSON.parse(oCookieUser);

        return oCookieUser;
    }
}

module.exports = function() {
    return new Who()
}