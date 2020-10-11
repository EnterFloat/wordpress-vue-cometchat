<template>
  <div>
    <Loader v-if="showmainloader" />
    <div v-else class="page-wrapper">
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
            >Logout {{ currentUser }}</a
          >
        </div>
        <!--Calls and Group list-->
        <LeftSidebar />
        <!--Chat Window-->
        <MessageContainer :currentUser="currentUser" />
        <!-- Chat Detail -->
        <RightSidebar />
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

export default {
  name: "ChatContainer",
  components: {
    Loader,
    LeftSidebar,
    MessageContainer,
    RightSidebar,
  },
  data() {
    return {
      leftOpen: true,
      centerOpen: false,
      rightOpen: false,
      currentUser: null,
      friendsToAdd: '["superhero1"]',
      friendsToRemove: '["superhero1"]',
      userMetadata: '{"gender": "male"}',
      showmainloader: true,
      uid: null,
      reloadIntervalChat: null,
    };
  },
  methods: {
    updateMetaButton() { // updateMetaButton: function ()
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
      this.ccGetUser()
        .then((data) => {
          this.currentUser = data.data;
        })
        .catch(() => {
          console.log(data);
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
    loginAndLoadDataChat() {
      this.showmainloader = true;
      console.log("loginAndLoadDataChat");
      this.handleAuth(false)
        .then((success) => {
          console.log("Success: ");
          console.log(success)
          this.showmainloader = false;
        })
        .catch((error) => {
          // location.href = "#/signed-out";
          console.log("Error: " + error);
        });
    },
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.reloadIntervalChat);
    next();
  },
  created() {  
    // CometChat.getLoggedinUser().then(
    //   (user) => {
    //     if (user) {
    //       this.currentUser = user;
    //     }
    //   },
    //   (error) => {
    //     console.log("yes here", error);
    //   }
    // );  
  },

  mounted() {
    // this.getUser();
    this.loginAndLoadDataChat();
    this.reloadIntervalChat = setInterval(() => {
      this.loginAndLoadDataChat();
    }, 1000000);
    this.$root.$on("selectedUser", (data) => {
      this.currentUser = data
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