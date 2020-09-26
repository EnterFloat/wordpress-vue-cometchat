<template>
  <div>
    <div class="page-wrapper">
      <div
        class="page-int-wrapper"
        id="pageWrapper"
        :class="{ 'left-open': leftOpen, 'center-open': centerOpen, 'right-open': rightOpen }"
      >
      <div class="buttons">
        <a class="get-meta-button" v-on:click="getMeta">Get meta</a>        
        <a class="get-meta-button" v-on:click="updateMetaButton">Update meta</a>        
        <a class="get-meta-button" v-on:click="getUser">Get user</a>        
        <form @submit="addFriends">
          <input name="friendsToAdd" v-model="friendsToAdd" type="text">
          <input type="submit" value="Add friends">
        </form>
        <form @submit="removeFriends">
          <input name="friendsToRemove" v-model="friendsToRemove" type="text">
          <input type="submit" value="Remove friends">
        </form>
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

export default {
  name: "ChatContainer",
  components: {
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
    };
  },
  methods: {
    updateMetaButton: function () {
      this.updateMeta({status: "god!"})
    },
    getUser: function () {
      this.ccGetUser("superhero3")
    },
    addFriends: function (e) {
      if (!this.friendsToAdd) {
        this.errors.push("uid required")
      }
      e.preventDefault();
      this.ccAddFriends(JSON.parse(this.friendsToAdd))
    },
    removeFriends: function (e) {
      if (!this.friendsToRemove) {
        this.errors.push("uid required")
      }
      e.preventDefault();
      this.ccRemoveFriends(JSON.parse(this.friendsToRemove))
    },
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
    this.$root.$on("selectedUser", (data) => {
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
    display: flex;
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