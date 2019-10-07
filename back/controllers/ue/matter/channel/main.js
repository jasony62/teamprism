const { ResultData, ResultFault, ResultObjectNotFound } = require('../../../../tms/ctrl')
const Base = require('../base')

class Main extends Base {
  constructor(...args) {
    super(...args)
  }
  async tmsBeforeEach() {
    let { app } = this.request.query
    if (!app) return new ResultFault(`参数错误`)

    let dmChannel = this.model('matter/channel')
    const oChannel = await dmChannel.byId(app)
    if (!oChannel || oChannel.state !== 1) return new ResultObjectNotFound()

    this.channel = oChannel

    return true
  }
  /**
   *
   */
  async get() {
    let site, mission
    // 团队信息
    let moSite = this.model('site')
    site = await moSite.byId(this.channel.siteid, { fields: moSite.fields_ue })
    if (false === site) return new ResultObjectNotFound()

    // 项目信息
    if (this.channel.mission_id) {
      let moMission = this.model('matter/mission')
      mission = await moMission.byId(this.channel.mission_id, { fields: moMission.fields_ue })
      if (false === mission) return new ResultObjectNotFound()
    }

    Object.assign(this.channel, { site, mission })

    return new ResultData(this.channel)
  }
  /**
   * 频道下的素材
   */
  async mattersGet() {
    let { batch } = this.request.query
    let [page, size] = batch.split(',').map(v => parseInt(v))
    let dbChanMatter = this.model('matter/channel/matter')
    let matters = await dbChanMatter.byChannel(this.channel, { page, size })
    let total = await dbChanMatter.countByChannel(this.channel)
    total = parseInt(total)

    return new ResultData({ matters, total })
  }
}

module.exports = Main
