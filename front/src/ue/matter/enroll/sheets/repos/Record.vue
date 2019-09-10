<template>
    <div id="repos-record">
        <tms-list :items="records">
            <template v-slot:item="{ item }">
                <record-list-item :record="item" :schemas="schemas" :user="user"></record-list-item>
            </template>
        </tms-list>
    </div>
</template>

<script>
import {Repos as RepApis} from "@/apis/matter/enroll"
import TmsList from "@/tms/components/List.vue"
import RecordListItem from "../../common/RecordListItem"
import { Notify } from 'vant'

export default {
    props: ['app', 'user'],
    data: function() {
        return {
            records: []
        }
    },
    components: { TmsList, RecordListItem },
    computed: {
        appid() {
            return this.app.id
        },
        schemas: function() {
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
                if (nv) this.fetchList(nv)
            },
            immediate: true
        }
    },
    methods: {
        async fetchList(appid) {
            try {
                let result = await RepApis.getList('recordList', appid)
                this.records = result.records
            } catch (e) {
                Notify({
                    message: e,
                    type: 'danger'
                });
                
            } 
        }
    }
};
</script>