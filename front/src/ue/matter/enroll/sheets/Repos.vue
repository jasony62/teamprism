<template>
    <div class="repos">
        <h1>Repos</h1>
        <hr />
        <Record />
    </div>
</template>

<script>
import Record from '../common/Record.vue'
export default {
    name: 'repos',
    components: {
        Record
    }
}
</script>