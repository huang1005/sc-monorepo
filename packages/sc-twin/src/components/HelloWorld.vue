<script lang="tsx">
import { ref, defineComponent } from "vue";
import { get } from "@runafe/platform-share";
import { useInit, useRender } from "@runafe/sc-three";
const { useRenderlayout } = useRender();
console.log(useRenderlayout);

export default defineComponent({
  name: "Layout",
  setup() {
    return () => <>{useRenderlayout()}</>;
  },
});
</script>

<template>11</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
