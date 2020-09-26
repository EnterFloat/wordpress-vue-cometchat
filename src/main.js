import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import routes from "./routes";
import { CometChat } from "@cometchat-pro/chat";
import { COMETCHAT_CONSTANTS } from "./CONSTS";
import { RestApi } from "./api";

Vue.config.productionTip = false;

var appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(COMETCHAT_CONSTANTS.REGION)
  .build();

CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting).then(() => {
  Vue.use(VueRouter);
  const router = new VueRouter({ routes });
  new Vue({
    router,
    render: h => h(App)
  }).$mount("#app");
});

let TheRestApi = new RestApi();
Vue.mixin({
  methods: {    
    getMeta() {
      TheRestApi.getMeta()
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    updateMeta(cometchat_data) {
      TheRestApi.updateMeta(cometchat_data)
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    ccGetUser(uid) {
      CometChat.getLoggedinUser()
        .then(usr => {
          if (typeof usr !== "undefined") {
            console.log(usr);
            return TheRestApi.ccGetUser(usr.uid);
          }
        })
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    ccAddFriends(uids) {      
        TheRestApi.ccAddFriends(uids)
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    ccRemoveFriends(uids) {      
        TheRestApi.ccRemoveFriends(uids)
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.log(error);
        });
    },
  }
});

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
