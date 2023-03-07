

<script lang="ts">
import Vue from 'vue'
import VTreeview from "vuetify/lib"

export default Vue.extend({
    name: 'EmittableTreeview',
    mixins: [VTreeview],
    data: () => ({
        reveal: false
    }),
    computed: {

    }
})
</script>