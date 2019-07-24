describe("#tms", function() {
    describe("#who.js", function() {
        let who = require('../../tms/who')()
        test("getCookieKey", () => {
            expect(who.getCookieKey('abc123')).toHaveLength(32)
        })
    })
})