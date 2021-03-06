import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import routes from "./routes";
import { CometChat } from "@cometchat-pro/chat";
import { COMETCHAT_CONSTANTS } from "./CONSTS";
import { RestApi } from "./api";
import EventBus from "./lib/cometchat-components/components/event-bus.js";
import UUID from "vue-uuid";
// import { resolve } from "core-js/fn/promise";

Vue.config.productionTip = false;

var appSetting = new CometChat.AppSettingsBuilder()
  .subscribePresenceForAllUsers()
  .setRegion(COMETCHAT_CONSTANTS.REGION)
  .build();

CometChat.init(COMETCHAT_CONSTANTS.APP_ID, appSetting).then(() => {
  Vue.use(VueRouter);
  Vue.use(UUID);
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
            return reject(
              '{"blinddaters_id":1,"user_meta":{"cometchat_id":"","users_to_unblock":{"221":{"UID":"221","name":"jack-black2","avatarURL":"","profileURL":"https://dev.blinddaters.dk/profil-side/?profile_id=221","role":"","unblocked":"false","cometchat_id":""}}}}'
            ); // reject
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
    ccCreateUser(data) {
      return new Promise((resolve, reject) => {
        TheRestApi.ccCreateUser(data)
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
    ccGetGroup(guid) {
      return new Promise((resolve, reject) => {
        TheRestApi.ccGetGroup(guid)
          .then(data => {
            return resolve(data);
          })
          .catch(error => {
            return reject(error);
          });
      });
    },
    ccJoinGroup(guid, uid) {
      return new Promise((resolve, reject) => {
        TheRestApi.ccJoinGroup(guid, uid)
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
    loadBlinddatersData(blinddaters_data) {
      return new Promise((resolve, reject) => {
        console.log("loadBlinddatersData:");
        console.log(blinddaters_data);
        if (blinddaters_data.user_meta.users_to_unblock) {
          let users_to_befriend = [];
          for (var key in blinddaters_data.user_meta.users_to_unblock) {
            users_to_befriend.push(
              blinddaters_data.user_meta.users_to_unblock[key]["UID"]
            );
            console.log(
              blinddaters_data.user_meta.users_to_unblock[key]["UID"]
            );
          }
          console.log(users_to_befriend);
          this.ccAddFriends(users_to_befriend)
            .then(success => {              
              console.log("Added friend(s):");
              console.log(success);
              let new_meta = {};
              for (const [key, value] of Object.entries(
                success.data.accepted
              )) {
                if (value.success == false) {
                  new_meta[key] =
                    blinddaters_data.user_meta.users_to_unblock[key];
                }
              }
              console.log(new_meta);
              return this.updateMeta(new_meta);
            })
            .then(status => {})
            .catch(error => {
              return reject(error);
            });
        }

        // let something_changed = false;
        // if (something_changed) {
        //   if (this.$route.name == "ChatContainer") this.$router.go();
        // } else {
        //   console.log("Nothing new");
        // }
        // alert("loadBlinddatersData")
      });
    },
    getMetaPlaceholder() {
      return new Promise((resolve, reject) => {
        let logged_in = true;
        if (logged_in) {
          return resolve({ cometchat_id: "superhero3" });
        } else {
          return reject({
            should_reload: false,
            component_name: "AppLoggedOut",
            message: "Not signed in on Blinddaters"
          });
        }
      });
    },
    ccSignIn(cometchat_id) {
      return new Promise((resolve, reject) => {
        CometChat.login(cometchat_id, COMETCHAT_CONSTANTS.API_KEY)
          .then(() => {
            return resolve({
              message: "Signed in correctly",
              component_name: "ChatContainer",
              should_reload: true
            });
          })
          .catch(() => {
            return reject(
              "Couldn't re sign in CometChat user with id: " + cometchat_id
            );
          });
      });
    },
    ccReSignIn(cometchat_id) {
      return new Promise((resolve, reject) => {
        // Perhaps check if the user is truly signed in?
        // Logout the old user
        CometChat.logout()
          .then(() => {
            console.log(
              "Logged out. Logging in again with cometchat_id: " + cometchat_id
            );
            return CometChat.login(cometchat_id, COMETCHAT_CONSTANTS.API_KEY); // Login the new user
          })
          .then(() => {
            // The user has been correctly re signed in
            console.log("Logged in again");
            return resolve({
              message: "Signed in correctly",
              component_name: "ChatContainer",
              should_reload: true
            });
          })
          .catch(error => {
            return reject(
              "Couldn't re sign in CometChat user with new id: " +
                cometchat_id +
                ". Error: " +
                error
            );
          });
      });
    },
    handleAuth(is_guest) {
      console.log(
        "Going to make sure, the right user is logged in. Otherwise logging out. First: check if we can get data from blinddaters."
      );
      let blinddaters_data = {};
      let should_reload = false
      return new Promise((resolve, reject) => {
        this.getMeta() // Getting metadata from Blinddaters REST API
          .then(data => {
            // A user is logged in on Blinddaters
            blinddaters_data = JSON.parse(data); // Metadata from Blinddaters REST API
            // Is the field empty?
            if (blinddaters_data.user_meta.cometchat_id == "") {
              throw "No associated CometChat User";
            } else {
              // A user is signed in to Blinddaters and a cometchat_id is associated
              return CometChat.getLoggedinUser(); // Let's check if a CometChat user is logged in
            }
          })
          .then(user => {
            if (user) {
              // A CometChat user is logged in
              console.log(
                "User already logged in with id: " +
                  user.uid +
                  ". Check if matches user from blinddaters"
              );
              // Does the Blinddaters metadata cometchat_id match with the signed in CometChat user?
              if (user.uid == blinddaters_data.user_meta.cometchat_id) {
                // Everything is good.
                console.log("It matches. We are done.");
                return {
                  component_name: "ChatContainer",
                  should_reload: false,
                  message: "It matches. We are done."
                };
              } else {
                // We have to re sign in with the cometchat_id from Blinddaters
                console.log("It doesn't match. Logging out");
                should_reload = true
                return this.ccReSignIn(blinddaters_data.user_meta.cometchat_id);
              }
            } else {
              // No CometChat user is logged in
              console.log(
                "User not logged in on CometChat. Signing in with id: " +
                  blinddaters_data.user_meta.cometchat_id
              );
              should_reload = true
              return this.ccSignIn(blinddaters_data.user_meta.cometchat_id); // Logging in with cometchat_id from Blinddaters
            }
          })
          .then(success => {
            // User is now logged in with ID from Blinddaters
            console.log("success");
            console.log(success);

            this.loadBlinddatersData(blinddaters_data) // Load news from Blinddaters like new friends and metadata updates
              .then(status => {
                // News loaded correctly
                console.log("loadBlinddatersData success: " + status);
              })
              .catch(error => {
                // Couldn't load news
                console.log("loadBlinddatersData error: " + error);
              });

            if (is_guest) {
              this.$router.push({
                name: "ChatContainer"
              });
              return reject("No guest needed.");
            }
            if (this.$route.name != "ChatContainer") {
              this.$router.push({
                name: "ChatContainer"
              });
            } else if (should_reload == true) {
              this.$router.go()
            }
            return resolve("Pushing to ChatContainer");

            // if (success) {
            //   if ("component_name" in success) {
            //     if ("should_reload" in success) {
            //       console.log("This router name: " + String(this.$route.name));
            //       console.log(
            //         "should_reload: " + String(success["should_reload"])
            //       );
            //       console.log(
            //         "component_name: " + String(success["component_name"])
            //       );
            //       if (
            //         this.$route.name == success["component_name"] &&
            //         success["should_reload"] == true
            //       ) {
            //         this.$router.go();
            //       } else if (
            //         success["component_name"] != "stay" &&
            //         this.$route.name != success["component_name"]
            //       ) {
            //         this.$router.push({
            //           name: success["component_name"]
            //         });
            //       }
            //     }
            //   }
            // }
            // console.log("Success is_guest: " + is_guest);
            // if (is_guest) {
            //   return reject("No guest needed.");
            // }
            // return resolve("Signed in correctly");
          })
          .catch(error => {
            console.log(error);
            console.log("is_guest: " + String(is_guest));
            if (is_guest) {
              console.log("A new user is needed")
              return resolve("A new user is needed.");
            }
            console.log("An error occured: ");
            console.log(error);
            CometChat.getLoggedinUser().then(user => {
              console.log(user);
              if (user) {
                CometChat.logout().then(() => {
                  if (this.$route.name != "AppLoggedOut") {
                    this.$router.push({
                      name: "AppLoggedOut"
                    });
                  }
                  return reject("Error signing in");
                });
              } else {
                console.log("User null");
                console.log("this.$route.name: " + String(this.$route.name));
                if (this.$route.name != "AppLoggedOut") {
                  console.log("Pushing to AppLoggedOut");
                  this.$router.push({
                    name: "AppLoggedOut"
                  });
                }
              }
              return reject("Error signing in");
            });
            // console.log(this.$router)
            // if (!this.$route.name == "AppLoggedOut") {
            //   this.$router.push({
            //     name: "AppLoggedOut",
            //   });
            // }
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
