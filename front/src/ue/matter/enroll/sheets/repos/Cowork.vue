<template>
    <div id="repos-cowork">
        <div>Repos Cowork</div>
        <tms-list :items="coworks">
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
            coworks: []
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
                if (nv) this.fetchList(nv)
            },
            immediate: true
        }        
    },
    methods: {
        async fetchList(appid) {
            try {
                let result = await RepApis.getList('coworkList', appid)
                this.coworks = result.coworks
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