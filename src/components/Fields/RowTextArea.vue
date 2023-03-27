<script>
import { defineComponent } from 'vue';
import { VTextarea } from 'vuetify/lib/components/VTextarea';
import { VTextField } from 'vuetify/lib/components/VTextField'

export default defineComponent({
  name: 'MyTextarea',
  extends: VTextarea,
  methods:{
    genInput() {
      const input = VTextField.options.methods.genInput.call(this);
      input.tag = 'textarea';
      delete input.data.attrs.type;
      input.data.attrs.rows = this.rows;
      return input;
    },
  }
});
</script>