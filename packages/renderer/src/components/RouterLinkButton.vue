<script setup lang="ts">
import Button from 'primevue/button';
type ToProp = string | {[key: string]: unknown};
const props = defineProps({
  to: {type: [String, Object] as unknown as unknown as () => ToProp, required: true, default: '/'},

  icon: {type: String, default: ''},
  label: {type: String, required: true},
});
</script>
<template>
  <router-link
    :to="props.to ?? '/'"
    class="text-yellow-800 hover:text-yellow-600 truncate w-full"
  >
    <Button
      class="w-full"
      :label="props.label"
      :icon="props.icon"
    />
  </router-link>
</template>
