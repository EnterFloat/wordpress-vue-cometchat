<template>
  <div>{{getMeta}}</div>
</template>
<script>
import $ from "jquery";
export default {
  name: "CometChatApi",
  // props: ["log_data"],
  methods: {
    getMeta() {
      console.log("get_meta");
      try {
        if (typeof myScriptVars === "undefined") {
          return;
        }
        $.ajax({
          method: "POST",
          url: myScriptVars.root + "wordpress-vue-cometchat/meta/get",
          data: { baz: 1, _wpnonce: myScriptVars.nonce },
          dataType: "json",
          success: function (data) {
            console.log(data);
          },
          statusCode: {
            403: function () {
              console.log("Access forbidden");
            },
          },
        });
      } catch (error) {
        console.log("Error: " + error);
      }
    },
    updateMeta(cometchat_data) {
      console.log("update_meta");
      try {
        if (typeof myScriptVars === "undefined") {
          return;
        }
        $.ajax({
          method: "POST",
          url: myScriptVars.root + "wordpress-vue-cometchat/meta/update",
          data: {
            cometchat_data: JSON.stringify(cometchat_data),
            baz: 1,
            _wpnonce: myScriptVars.nonce,
          },
          dataType: "json",
          success: function (data) {
            console.log(data);
          },
          statusCode: {
            403: function () {
              console.log("Access forbidden");
            },
          },
        });
      } catch (error) {
        console.log("Error: " + error);
      }
    },
  },
};
</script>