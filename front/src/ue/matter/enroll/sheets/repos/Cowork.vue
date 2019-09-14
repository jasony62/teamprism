<template>
    <div id="repos-cowork">
        <tms-list :items="coworks" :pageInfo="page" @loadmore="fetchList(app.id, page.at)">
            <template v-slot:item="{ item }">
                <cowork-list-item :cowork="item" :schemas="schemas" :user="user"></cowork-list-item>
            </template>
        </tms-list>
    </div>
</template>
<script>
import {Repos as RepApis} from "@/apis/matter/enroll"
import TmsList from '@/tms/components/List.vue'
import CoworkListItem from '../../common/CoworkListItem'
import { Notify } from 'vant'

export default {
    props: {
        app: Object,
        user: Object
    },
    data: function() {
        return {
            coworks: [],
            page: {
                at: 1,
                size: 20,
                total: 0
            }
        }
    },
    components: { TmsList, CoworkListItem },
    computed: {
        appid() {
            return this.app.id
        },
        schemas() {
            var _aShareableSchemas = [];
            this.app.dynaDataSchemas.forEach((oSchema) => {
                if (oSchema.shareable === 'Y') {
                    _aShareableSchemas.push(oSchema);
                }
            });
            return _aShareableSchemas;
        }
    },
    watch: {
        appid: {
            async handler(nv) {
                if (nv) this.fetchList(nv, 1)
            },
            immediate: true
        }        
    },
    methods: {
        async fetchList(appid, pageAt) {
            try {
                pageAt ? this.page.at = pageAt : this.page.at
                let result = await RepApis.getList('coworkList', appid, this.page)
                let moment = require('moment')
                result.datas.forEach(cowork => {
                    cowork._createAt = moment(cowork.enroll_at * 1000).format('YYYY-MM-DD h:mm:ss')
                    this.coworks.push(cowork)
                })
                this.page.total = result.total;
                this.page.at += 1;
            } catch (e) {
                Notify({
                    message: e,
                    type: 'danger'
                });
            } 
        }
    }
}
</script>