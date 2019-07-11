<template>
    <div id="userSwitch">
        <el-switch
          v-model="value"
          active-text="按月付费"
          inactive-text="按年付费">
        </el-switch>
    </div>
</template>



<script>
  export default {
    data() {
      return {
        value: true,
      }
    }
  };
</script>