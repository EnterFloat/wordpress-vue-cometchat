<template>
  <div>{{log(log_data)}}</div>
</template>
<script>
import $ from 'jquery'
export default {
  name: "Log",
  props: ["log_data"],
  data() {
    return {
      log: (log_data) => {        
        console.log(log_data);
      },
    };
  },
};
</script>