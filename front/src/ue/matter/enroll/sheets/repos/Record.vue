<template>
    <div id="repos-record">
        <div>Repos Record</div>
        <tms-list :items="records">
            <template v-slot:item="{ item }">
                <record-list-item :record="item"></record-list-item>
            </template>
        </tms-list>
    </div>
</template>
<script>
import qs from 'query-string'
import TmsList from "@/tms/components/List.vue";
import RecordListItem from "../../common/RecordListItem";
import apis from "@/apis/matter/enroll/sheets/repos.js";

export default {
    props: {
        app: Object
    },
    data: function() {
        return {
            records: []
        }
    },
    components: { TmsList, RecordListItem },
    computed: {
        schemas: function() {
            var _aShareableSchemas = [];
            this.app.dynaDataSchemas.forEach((oSchema) => {
                if (oSchema.shareable === 'Y') {
                    _aShareableSchemas.push(oSchema);
                    return _aShareableSchemas;
                }
            })
        }
    },
    created() {
        this.fetchList();
    },
    watch: {
        '$route': fetchList
    },
    methods: {
        async fetchList() {
            let params = qs.parse(location.search);
            try {
                if (params.app) {
                    let records = await apis.getList('record', params.app)
                    this.records = records
                }
            } catch (e) {
                this.$message({
                    message: e,
                    type: 'error',
                    duration: 60000,
                    showClose: true
                })
            } finally {
                
            }
        }
    }
};
</script>