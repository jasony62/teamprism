describe("#models", () => {
    describe("#matter", () => {
        describe("#channel", () => {
            describe("index.js", () => {
                test("byId()", async () => {
                    let dmChannel = require('../../../../models/matter/channel').create({ debug: true })
                    await dmChannel.byId(1)
                    expect(dmChannel.execSqlStack[0]).toMatch(/^select \* from xxt_channel where id='1'$/i)
                })
                test("byIds()", async () => {
                    let dmChannel = require('../../../../models/matter/channel').create({ debug: true })
                    await dmChannel.byIds([1, 2, 3])
                    expect(dmChannel.execSqlStack[0]).toMatch(/^select \* from xxt_channel where id in\('1','2','3'\)$/i)
                })
                test("byMatter()", async () => {
                    let dmChannel = require('../../../../models/matter/channel').create({ debug: true })
                    await dmChannel.byMatter(1, 'article')
                    let sql = "SELECT c.id,c.title,cm.create_at,c.config,c.style_page_id,c.header_page_id,c.footer_page_id,c.style_page_name,c.header_page_name,c.footer_page_name,'channel' type FROM xxt_channel_matter cm,xxt_channel c WHERE cm.matter_id='1' and cm.matter_type='article' and \\(cm.channel_id=c.id and c.state=1\\) ORDER BY cm.create_at desc"
                    let sqlRegx = new RegExp(sql, 'i')
                    expect(dmChannel.execSqlStack[0]).toMatch(sqlRegx)
                })
            })
        })
    })
})