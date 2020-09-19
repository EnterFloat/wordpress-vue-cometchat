import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import routes from './routes';
import { CometChat } from "@cometchat-pro/chat";
import {COMETCHAT_CONSTANTS} from './CONSTS';
import $ from "jquery";

Vue.config.productionTip = false;

var appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(COMETCHAT_CONSTANTS.REGION).build();

CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting).then(()=>{

  Vue.use(VueRouter);
  const router = new VueRouter({routes});
  new Vue({
    router,
    render: h => h(App),
  }).$mount('#app');
})

Vue.mixin({
  methods: {
    getMeta() {
      console.log("get_meta");      
      try {
        if (typeof myScriptVars === "undefined") {
          console.log("myScriptVars undefined")
          return;
        }
        $.ajax({
          method: "POST",
          url: myScriptVars.root + "wordpress-vue-cometchat/meta/get",
          data: { _wpnonce: myScriptVars.nonce },
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
      console.log(cometchat_data);
      console.log(JSON.stringify(cometchat_data));
      
      try {
        if (typeof myScriptVars === "undefined") {
          console.log("myScriptVars undefined")
          return;
        }
        console.log(cometchat_data)
        $.ajax({
          method: "POST",
          url: myScriptVars.root + "wordpress-vue-cometchat/meta/update",
          data: {
            cometchat_data: JSON.stringify(cometchat_data),
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
})



// let init : function() {
//     this.loading = true;
//     let params = new URLSearchParams(location.search); 

//     return new Promise((res,rej)=>{
//       var appSetting = new CometChat.AppSettingsBuilder().subscribePresenceForAllUsers().setRegion(COMETCHAT_CONSTANTS.REGION).build();
//       //initialize cometchat manager
//       CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting).then(()=>{
//         CometChat.login(params.get('uid'), COMETCHAT_CONSTANTS.API_KEY).then((user)=>{
//           console.log('current log : ', user);
//           this.currentUser = user;
//           this.isLoggedin = true;
//           this.loading = false;

//           res(user);
//         },error=>{
//           location.href = '/';
//           rej(error);
//         });
//       })
//     });
    

//   },


