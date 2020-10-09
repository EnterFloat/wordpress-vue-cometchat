import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import routes from "./routes";
import { CometChat } from "@cometchat-pro/chat";
import { COMETCHAT_CONSTANTS } from "./CONSTS";
import { RestApi } from "./api";
// import { resolve } from "core-js/fn/promise";

Vue.config.productionTip = false;

var appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(COMETCHAT_CONSTANTS.REGION)
  .build();

CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting).then(() => {
  Vue.use(VueRouter);
  const router = new VueRouter({
    routes
  });
  new Vue({
    router,
    render: h => h(App)
  }).$mount("#app");
});

let TheRestApi = new RestApi();
Vue.mixin({
  methods: {
    getMeta() {
      return new Promise((resolve, reject) => {
        TheRestApi.getMeta()
          .then(data => {
            return resolve(data);
          })
          .catch(error => {
            return reject(error);
          });
      });
    },
    updateMeta(cometchat_data) {
      return new Promise((resolve, reject) => {
        TheRestApi.updateMeta(cometchat_data)
          .then(data => {
            return resolve(data);
          })
          .catch(error => {
            return reject(error);
          });
      });
    },
    ccGetUser() {
      return new Promise((resolve, reject) => {
        TheRestApi.ccGetUser()
          .then(data => {
            return resolve(data);
          })
          .catch(error => {
            return reject(error);
          });
      });
    },
    ccUpdateUser(metadata) {
      return new Promise((resolve, reject) => {
        TheRestApi.ccUpdateUser(metadata)
          .then(data => {
            return resolve(data);
          })
          .catch(error => {
            return reject(error);
          });
      });
    },
    ccAddFriends(uids) {
      return new Promise((resolve, reject) => {
        TheRestApi.ccAddFriends(uids)
          .then(data => {
            return resolve(data);
          })
          .catch(error => {
            return reject(error);
          });
      });
    },
    ccRemoveFriends(uids) {
      return new Promise((resolve, reject) => {
        TheRestApi.ccRemoveFriends(uids)
          .then(data => {
            return resolve(data);
          })
          .catch(error => {
            return reject(error);
          });
      });
    },
    loadBlinddatersData() {
      console.log("loadBlinddatersData");
      location.href = "/#";      
      // alert("loadBlinddatersData")
    },
    getMetaPlaceholder() {
      return new Promise((resolve, reject) => {
        let logged_in = true;
        if (logged_in) {
          return resolve({ cometchat_id: "superhero3" });
        } else {
          return reject({ should_reload: false, message: "Not signed in on Blinddaters"});
        }
      });
    },
    ccSignIn(cometchat_id) {
      return new Promise((resolve, reject) => {
        CometChat.login(cometchat_id, COMETCHAT_CONSTANTS.API_KEY)
          .then(() => {
            console.log("Logged in again");
            return resolve({
              message: "Signed in correctly",
              should_reload: true
            });
          })
          .catch(() => {
            reject(
              "Couldn't re sign in CometChat user with id: " + cometchat_id
            );
          });
      });
    },
    ccReSignIn(cometchat_id) {
      return new Promise((resolve, reject) => {
        CometChat.logout().then(() => {
          console.log(
            "Logged out. Logging in again with cometchat_id: " + cometchat_id
          );
          return CometChat.login(cometchat_id, COMETCHAT_CONSTANTS.API_KEY);
        });
        CometChat.login(cometchat_id, COMETCHAT_CONSTANTS.API_KEY)
          .then(() => {
            console.log("Logged in again");
            return resolve({
              message: "Signed in correctly",
              should_reload: true
            });
          })
          .catch(() => {
            reject(
              "Couldn't re sign in CometChat user with id: " + cometchat_id
            );
          });
      });
    },
    handleAuth() {
      console.log(
        "Going to make sure, the right user is logged in. Otherwise logging out. First: check if we can get data from blinddaters."
      );
      return new Promise((resolve, reject) => {
        let blinddaters_data = {};
        this.getMetaPlaceholder() // Should be: this.getMeta()
          .then(data => {
            blinddaters_data = data;
            return CometChat.getLoggedinUser();
            // console.log(
            //   "Got data from Blinddaters. Checking if user is signed in."
            // );
            // if (data["logged_in"] == true) {
            //   console.log(
            //     "User is signed in on Blinddaters. Getting signed in CometChat user."
            //   );
            //   return CometChat.getLoggedinUser();
            // } else if (data["logged_in"] == false) {
            //   console.log("User is not signed in on Blinddaters. Signing out.");
            //   return reject("User not signed in on Blinddaters.");
            // }
          })
          .then(user => {
            if (user) {
              console.log(
                "User already logged in with id: " +
                  user.uid +
                  ". Check if matches user from blinddaters"
              );
              if (user.uid == blinddaters_data["cometchat_id"]) {
                console.log("It matches. We are done.");
                return resolve("Signed in correctly");
              } else {
                console.log("It doesn't match. Logging out");
                return this.ccReSignIn(blinddaters_data["cometchat_id"]);
              }
            } else {
              console.log(
                "User not logged in on CometChat. Signing in with id: " +
                  blinddaters_data["cometchat_id"]
              );
              return this.ccSignIn(blinddaters_data["cometchat_id"]);
            }
          })
          .then(success => {
            this.loadBlinddatersData();
            if (success) {
              if ("should_reload" in success) {
                if (success["should_reload"] == true) {
                  console.log("should_reload");
                  location.reload();
                }
              }
            }
            return resolve("Signed in correctly");
          })
          .catch(error => {
            console.log("An error occured: ");
            console.log(error)
            CometChat.getLoggedinUser().then(user => {
              console.log(user);
              if (user) {
                CometChat.logout();
              }
            });
            if (!location.href == "/#signed-out") {
              location.href = "/#signed-out";              
            }
            return reject("Error signing in");
          });
      });
    },
    created() {
      console.log("created");
      this.getMeta().then(data => {
        console.log("created: " + data);
      });
    }
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
