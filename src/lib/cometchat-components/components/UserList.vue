<template>
  <div>
    <!-- <div class="ccl-left-panel-srch-wrap "> -->
    <div class="ccl-left-panel-head-wrap">
      <div class="ccl-left-panel-srch-inpt-wrap">
        <input
          autocomplete="off"
          class="ccl-left-panel-srch font-15 ccl-secondary-color"
          placeholder="Search"
          type="text"
          maxlength="200"
          @input="onSearchChange($event)"
        />
        <input id="searchButton" type="button" class="search-btn" />
      </div>
    </div>

    <div v-if="usersList.length == 0" class="cometchat-message-container">
      <p>{{ messageToDisplay }}</p>
    </div>

    <div
      class="chat-contact-list-ext-wrap scroll-container"
      @scroll="handleUserScroll($event)"
      v-else-if="usersList.length != 0"
    >
      <div class="contact-list-wrpr" v-for="(userRow, i) in usersList" :key="i">
        <div
          class="chat-ppl-listitem clearfix"
          v-on:click="currentUser(userRow)"
          v-if="userRow.metadata"          
        >
          <span
            class="chat-contact-list-apla-ftlr"
            v-if="
              i > 0 &&
              usersList[i - 1].name.charAt(0).toUpperCase() !==
                userRow.name.charAt(0).toUpperCase()
            "
            >{{
              i > 0 &&
              usersList[i - 1].name.charAt(0).toUpperCase() ===
                userRow.name.charAt(0).toUpperCase()
                ? ""
                : userRow.name.substring(0, 1).toUpperCase()
            }}</span
          >
          <!-- <span v-if="
             userRow.metadata
          "
          :class="userRow.metadata.gender">{{userRow.metadata.gender}}</span>           -->
          <Avatar :item="userRow" />
          <div class="chat-ppl-listitem-dtls">
            <span :class="userRow.metadata.gender" class="chat-ppl-listitem-name">{{ userRow.name }}</span>
          </div>          
        </div>
        <div
          class="chat-ppl-listitem clearfix"
          v-on:click="currentUser(userRow)"
          v-else
        >
          <span
            class="chat-contact-list-apla-ftlr"
            v-if="
              i > 0 &&
              usersList[i - 1].name.charAt(0).toUpperCase() !==
                userRow.name.charAt(0).toUpperCase()
            "
            >{{
              i > 0 &&
              usersList[i - 1].name.charAt(0).toUpperCase() ===
                userRow.name.charAt(0).toUpperCase()
                ? ""
                : userRow.name.substring(0, 1).toUpperCase()
            }}</span
          >
          <!-- <span v-if="
             userRow.metadata
          "
          :class="userRow.metadata.gender">{{userRow.metadata.gender}}</span>           -->
          <Avatar :item="userRow" />
          <div class="chat-ppl-listitem-dtls">
            <span class="chat-ppl-listitem-name">{{ userRow.name }}</span>
          </div>          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CometChat } from "@cometchat-pro/chat";
import Avatar from "./Avatar";
import Log from "./Log";
import EventBus from "./event-bus.js";

export const STRING_CONSTS = {
  STRING_MESSAGES: {
    LOADING_MESSSAGE: "Loading...",
    SEARCH_LOADING: "Searching...",
    ERROR_LOADING_USERS: "Error in loading",
    ERROR_COMETCHAT_LOGIN: "Loag in error, reload",
    ERROR_NO_USERS_FOUND: "No users found",
    EMPTY_STRING: "",
    SINGLE_SPACE: " ",
  },
};

export default {
  name: "UserList",
  components: {
    Avatar,
    Log,
  },
  data() {
    return {
      usersList: [],
      usersRequest: "",
      messageToDisplay: "",
      callUser(searchKey) {
        if (searchKey) {
          this.usersRequest = new CometChat.UsersRequestBuilder()
            .setLimit(30)
            .setSearchKeyword(searchKey)
            .friendsOnly(true)
            .build();
        } else {
          this.usersRequest = new CometChat.UsersRequestBuilder()
            .setLimit(30)
            .friendsOnly(true)
            .build();
        }
        return this.usersRequest;
      },
      userFetchNext() {
        return this.usersRequest.fetchNext();
      },
    };
  },
  methods: {
    updateUsersList(data) {
      this.usersList = []
      this.getUserlist();
    },
    currentUser(data) {
      console.log("currentUser in UsersList")
      console.log(data)
      this.$root.$emit("selectedUser", data);
    },
    getUserlist(data) {
      this.callUser(data)
        .fetchNext()
        .then(
          (users) => {
            this.usersList = [...this.usersList, ...users];
          },
          (error) => {
            console.log(error);
          }
        );
    },

    handleUserScroll(elem) {
      if (
        elem.target.offsetHeight + elem.target.scrollTop >=
        elem.target.scrollHeight - 20
      ) {
        this.userFetchNext().then(
          (users) => {
            this.usersList = [...this.usersList, ...users];
          },
          (error) => {
            console.log(error);
          }
        );
      }
    },

    onSearchChange(event) {
      this.usersList = [];
      if (this.searchStarted) {
        clearTimeout(this.searchStarted);
      }
      if (
        event.target.value.trim() !== STRING_CONSTS.STRING_MESSAGES.EMPTY_STRING
      ) {
        this.searchStarted = setTimeout(() => {
          this.messageToDisplay = STRING_CONSTS.STRING_MESSAGES.SEARCH_LOADING;
          this.getUserlist(event.target.value);
        }, 400);
      } else if (
        event.target.value.trim() ===
          STRING_CONSTS.STRING_MESSAGES.EMPTY_STRING &&
        event.data === null
      ) {
        event.target.value = STRING_CONSTS.STRING_MESSAGES.EMPTY_STRING;
        this.searchStarted = setTimeout(() => {
          this.getUserlist();
        }, 400);
      } else if (
        event.target.value.trim() ===
          STRING_CONSTS.STRING_MESSAGES.EMPTY_STRING &&
        event.data === STRING_CONSTS.STRING_MESSAGES.SINGLE_SPACE
      ) {
        event.target.value = STRING_CONSTS.STRING_MESSAGES.EMPTY_STRING;
      }
    },
  },
  created() {
    this.getUserlist();    
  },
  mounted() {
    EventBus.$on("update-users-list", this.updateUsersList);
  },
};
</script>

<style scoped>
.chat-contact-list-apla-ftlr {
  position: absolute;
  top: 0;
}

.male {
  color: #1871c9;
}
.female {
  color: #db3a16;
}

.chat-ppl-listitem-dtls {
  display: inline-block;
  -webkit-box-flex: 1;
  -ms-flex: 1 1 0px;
  flex: 1 1 0;
  padding-bottom: 25px;
  border-bottom: 1px solid #f7f7f7;
  font-weight: 600;
}

.chat-ppl-listitem {
  padding: 22px 16px 0;
  position: relative;
  margin-top: -1px;
  cursor: pointer;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.chat-ppl-listitem-name {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.1px;
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 7px 0 0;
}
</style>