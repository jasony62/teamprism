describe("#tms", function() {
    describe("#client.js", function() {
        const siteid = 'anysiteid'
        const clientUser = { uid: 'anyuserid' }

        test("新建客户端", () => {
            const { CookieClient } = require('../../tms/client')
            let encodedCookie = CookieClient.setCookieUser(siteid, clientUser)
            let req = {
                query: {
                    site: 'anysiteid'
                },
                cookies: {
                    xxt_site_anysiteid_fe_user: encodedCookie
                }
            }

            let client = require('../../tms/client').create(req)
            expect(client).toMatchObject({ siteid: 'anysiteid', id: 'anyuserid', data: { uid: 'anyuserid' } })
        })
    })
})