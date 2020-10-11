<template>
  <div>
    <!-- <Loader v-if="showmainloader" /> -->
    <div class="page-wrapper">
      <div
        class="page-int-wrapper"
        id="pageWrapper"
        :class="{
          'left-open': leftOpen,
          'center-open': centerOpen,
          'right-open': rightOpen,
        }"
      >
        <div class="buttons">
          <a class="get-meta-button" v-on:click="getMeta">Get meta</a>
          <a class="get-meta-button" v-on:click="updateMetaButton"
            >Update meta</a
          >
          <a class="get-meta-button" v-on:click="getUser">Get user</a>
          <a class="get-meta-button" v-on:click="updateUser">Update user</a>
          <form @submit="updateUser">
            <input name="userMetadata" v-model="userMetadata" type="text" />
            <input type="submit" value="Update metadata" />
          </form>
          <form @submit="addFriends">
            <input name="friendsToAdd" v-model="friendsToAdd" type="text" />
            <input type="submit" value="Add friends" />
          </form>
          <form @submit="removeFriends">
            <input
              name="friendsToRemove"
              v-model="friendsToRemove"
              type="text"
            />
            <input type="submit" value="Remove friends" />
          </form>
          <a class="get-meta-button" v-on:click="logout"
            >Logout {{ currentUser.uid }}</a
          >
          <a class="get-meta-button" v-on:click="getUser">getUser</a>
        </div>
        <!--Calls and Group list-->
        <!-- <LeftSidebar /> -->
        <!--Chat Window-->
        <MessageContainer :currentUser="currentUser" />
        <!-- Chat Detail -->
        <!-- <RightSidebar /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { CometChat } from "@cometchat-pro/chat";
import LeftSidebar from "./LeftSidebar";
import MessageContainer from "./MessageContainer";
import RightSidebar from "./RightSidebar";
import Loader from "./Loader";
import { COMETCHAT_CONSTANTS } from "../../../CONSTS";

// const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey

// const shortName = uniqueNamesGenerator({
//   dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
//   length: 2
// }); // big-donkey

export default {
  name: "GuestChatContainer",
  components: {
    Loader,
    LeftSidebar,
    MessageContainer,
    RightSidebar,
  },
  data() {
    return {
      leftOpen: false,
      centerOpen: true,
      rightOpen: false,
      currentUser: null,
      friendsToAdd: '["superhero1"]',
      friendsToRemove: '["superhero1"]',
      userMetadata: '{"gender": "male"}',
      showmainloader: false,
      uid: null,
      reloadIntervalChat: null,
    };
  },
  methods: {
    updateMetaButton() {
      // updateMetaButton: function ()
      this.updateMeta({
        cometchat_id: "superhero1",
        users_to_unblock: {
          221: {
            UID: "221",
            name: "jack-black2",
            avatarURL: "",
            profileURL:
              "https://dev.blinddaters.dk/profil-side/?profile_id=221",
            role: "",
            unblocked: false,
            cometchat_id: "",
          },
        },
      })
        .then((data) => {
          console.log(data);
        })
        .catch(() => {
          console.log(data);
        });
    },
    getUser() {
      return new Promise((resolve, reject) => {
        this.ccGetUser()
          .then((data) => {
            console.log("getUser");
            this.currentUser = data.data;
            console.log(this.currentUser);
            return resolve(this.currentUser);
          })
          .catch((error) => {
            console.log(error);
            // this.router.go()// this.logout()
            return reject(error);
          });
      });
    },
    updateUser(e) {
      if (!this.userMetadata) {
        this.errors.push("userMetadata required");
      }
      e.preventDefault();
      this.ccUpdateUser(JSON.parse(this.userMetadata))
        .then((data) => {
          console.log(data);
        })
        .catch(() => {
          console.log(data);
        });
    },
    addFriends(e) {
      if (!this.friendsToAdd) {
        this.errors.push("uid required");
      }
      e.preventDefault();
      this.ccAddFriends(JSON.parse(this.friendsToAdd))
        .then((data) => {
          console.log(data);
        })
        .catch(() => {
          console.log(data);
        });
    },
    removeFriends(e) {
      if (!this.friendsToRemove) {
        this.errors.push("uid required");
      }
      e.preventDefault();
      this.ccRemoveFriends(JSON.parse(this.friendsToRemove))
        .then((data) => {
          console.log(data);
        })
        .catch(() => {
          console.log(data);
        });
    },
    logout() {
      console.log("Logging out");
      CometChat.logout()
        .then(() => {
          console.log("Logged out logout button");
          // location.href = "#/signed-out";
          this.$router.push({
            name: "AppLoggedOut",
          });
        })
        .catch((error) => {
          console.log("Couldn't log out error: " + error);
          // location.href = "#/signed-out";
          this.$router.push({
            name: "AppLoggedOut",
          });
        });
    },
    createUserJoinChat() {
      let new_user;
      new_user = {
        uid: "12345",
        name: "GUEST_" + "12345678",
        role: "guest",
      };
      let found_group;
      this.showmainloader = true;
      console.log("createUserJoinChat");
      this.handleAuth(true)
        .then((status) => {
          return new Promise((resolve, reject) => {
            CometChat.getLoggedinUser().then((user) => {
              if (user) {
                return "A guest must already be signed in";
              } else {
                let uuid = String(this.$uuid.v4());
                new_user = {
                  uid: uuid,
                  name: "GUEST_" + uuid.slice(0, 8),
                  role: "guest",
                };
                this.ccCreateUser(new_user)
                  .then((status) => {
                    console.log("User created!");
                    console.log(status);
                    return this.ccSignIn(new_user.uid);
                  })
                // this.ccSignIn(new_user.uid) // remove this
                  .then((status) => {
                    console.log(status);
                    this.getUser().then((user) => {
                      console.log(user);
                      if (user) {
                        console.log("Guest user has been signed in!");
                        return resolve(this.ccGetGroup("publicgroup"));
                      } else {
                        console.log("Guest user not signed in!!");
                        throw "Not signed in correctly";
                      }
                    });
                  })
                  .catch((error) => {
                    console.log(error);
                    return reject("New guest couldn't be created");
                  });
              }
            });
          });
        })
        .then((group) => {
          console.log("Found group");
          found_group = group.data;
          return this.ccJoinGroup(found_group.guid, new_user.uid);
        })
        .then((success) => {
          console.log("Joined group");
          console.log(success);
          console.log(found_group);
          // this.uid = new_user.uid;
          this.showmainloader = false;
          // this.currentUser = new_user
          this.getUser().then((user) => {
            this.$root.$emit("selectedUser", found_group);
          });
          this.$router.push({
            name: "GuestChatContainer",
          });
          console.log(found_group);
        })
        .catch((error) => {
          console.log(
            "Error. Either a user exists, or a gust couldn't be created: "
          );
          console.log(error);
        });
    },
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.reloadIntervalGuest);
    next();
  },
  created() {
    CometChat.getLoggedinUser().then(
      (user) => {
        if (user) {
          this.currentUser = user;
        }
      },
      (error) => {
        console.log("yes here", error);
      }
    );
  },

  mounted() {
    this.getUser();
    this.createUserJoinChat();
    this.reloadIntervalGuest = setInterval(() => {
      this.createUserJoinChat();
    }, 1000000);
    this.$root.$on("selectedUser", (data) => {
      console.log("GuestChatContainer selectedUser");
      console.log(data);
      const el = document.getElementById("pageWrapper");
      console.log("back butn", el);
      if (el.classList.contains("left-open")) {
        el.classList.add("center-open");
        el.classList.remove("left-open");
      }
    });
  },
};
</script>

<style>
div.buttons {
  display: none; /* display: flex */
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.get-meta-button {
  cursor: pointer;
  display: block;
  background: black;
  color: white;
  padding: 0.4rem;
  margin: 1rem;
}
@media (min-width: 320px) and (max-width: 767px) {
  .page-int-wrapper .ccl-left-panel,
  .page-int-wrapper .ccl-center-panel,
  .page-int-wrapper .ccl-right-panel {
    display: none;
  }

  .page-int-wrapper.left-open .ccl-left-panel {
    display: block;
  }

  .page-int-wrapper.center-open .ccl-center-panel {
    display: block;
  }

  .page-int-wrapper.right-open .ccl-right-panel {
    display: block !important;
  }

  .cc1-chat-win-con-opt {
    margin-left: 10px;
  }

  .cc1-chat-win-inpt-attach a,
  .cc1-chat-win-inpt-send a {
    margin-top: 0px;
  }
}
</style>