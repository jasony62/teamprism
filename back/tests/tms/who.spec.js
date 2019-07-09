describe("#tms", function () {
    describe("#who.js", function () {
        let who = require('../../tms/who')()
        test("getCookieKey", () => {
            expect(who.getCookieKey('abc123')).toHaveLength(32)
        })
        // test("getCookieUser", () => {
        //     let encoded = 'mfW6Slnti8fpYOZmdLZw7Rt6RDWz6-gVHhltsChlBi3O4T32TrS8-7Bmjr9NtJTtqbsa9ra6PGypP1cQDh-r3ic9EeyZwhue2exKhdtTHAIJEAy4ri7zyHpxn3ILZxckf-UmdLQj-eQI3MLxVIdzuJkMNX3-E_UMPK4kg8Pk'
        //     //let encoded = 'mfW6Slnti8fpYOZmdLZw7Rt6RDWz6-gVHhltsChlBi3O4T32TrS8-7Bmjr9NtJTtqbsa9ra6PGypP1cQDh-r3ic9EeyZwhue2exKhdtTHAIJEAy4ri7zyHpxn3ILZxckf-UmdLQj-eQI3MLxVIdzuJkMNX3-E_UMPK4kg8Pk'
        //     console.log('lll', encoded.length)
        //     let decoded = who.getCookieUser('51855414326b5ff2b1b4a3b5d366393c', encoded)
        //     expect(decoded).toBe('ok')
        // })
    })
})