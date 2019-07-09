describe("#tms", function () {
    describe("#model.js", function () {
        let Model = require('../../tms/model')
        test("encrypt", () => {
            let key = '58285b69b97f1eac8d27cf9df0919d60';
            let str, encoded, decoded
            str = "{}"
            encoded = Model.encryptEnc(str, key)
            decoded = Model.encryptDec(encoded, key)
            expect(decoded).toBe(str)
        })
    })
})