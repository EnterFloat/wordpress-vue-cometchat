<template>
  <div>
    <!-- clearfix -->
    <div class="cc1-chat-win-header" v-if="userData.uid || userData.guid">
      <!-- For user -->
      <div class="cc1-chat-win-user">
        <div v-if="isGuest == false">
          <a href="javascript:;" class="back-btn" v-on:click="backToLeft()"
            >&nbsp;</a
          >
        </div>
        <div class="cc1-chat-win-user-thumb">
          <img v-if="userData.avatar" :src="userData.avatar" />
          <img v-else-if="userData.icon" :src="userData.icon" />
          <div
            class="avatar"
            v-bind:style="{ 'background-color': randomcolor() }"
            v-else
          >
            {{ userData.name.charAt(0).toLowerCase() }}
          </div>
        </div>

        <div class="cc1-chat-win-user-name-wrap">
          <h6
            v-if="userData.metadata"
            :class="userData.metadata.gender"
            class="cc1-chat-win-user-name"
          >
            {{ userData.name }}
          </h6>
          <h6 v-else class="cc1-chat-win-user-name">{{ userData.name }}</h6>
          <span
            class="cc1-chat-win-user-status ccl-blue-color"
            v-if="userData.status !== 'offline'"
            >{{ userData.status }}</span
          >
          <span
            class="cc1-chat-win-user-status"
            v-else-if="userData.status === 'offline' && userData.lastActiveAt"
            >Sidst aktiv: {{ getDate(userData.lastActiveAt) }}</span
          >
        </div>
      </div>
      <div class="signup-banner"
      v-on:click="signup">
      <a
        class="signup-banner-link"
        v-if="isGuest == true"
        type="button"
        >Du chatter som {{currentUser.name}}. Opret dig på <span>Blinddaters</span>
        </a>
        </div>
      <!-- <div class="cc1-chat-win-con-opt-wrap"> -->
      <!-- <a href="javascript:void(0);" class="cc1-chat-win-con-opt call" v-on:click="makeAudioCall($event)"></a> -->
      <!-- <a href="javascript:void(0);" class="cc1-chat-win-con-opt video-call" v-on:click="makeVideoCall($event)"></a> -->
      <!-- <a href="javascript:void(0);" class="cc1-chat-win-con-opt details" v-on:click="clickMenuOption()"></a> -->
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import { CometChat } from "@cometchat-pro/chat";

export default {
  name: "MessageHeader",
  props: ["currentUser"],
  data() {
    return {
      menuOption: false,
      userData: {},
      isGuest: false,
    };
  },
  // props:['userData'],

  mounted() {
    this.$root.$on("selectedUser", (data) => {
      this.userData = data;
    });
  },

  methods: {
    signup() {
      window.open("https://dev.blinddaters.dk", "_blank");
    },
    getDate(datetime) {
      let date = new Date(datetime * 1000);
      return date.toLocaleTimeString();
    },

    randomcolor: () => {
      let color = Math.floor(0x1000000 * Math.random()).toString(16);
      let bgcolor = "#" + ("000000" + color).slice(-6);
      return bgcolor;
    },

    makeAudioCall(event) {
      console.log("Audio call", event);
    },

    makeVideoCall(event) {
      console.log("Video call", event);
    },

    clickMenuOption() {
      this.menuOption = !this.menuOption;
      this.$root.$emit("menuOpen", this.menuOption);

      const el = document.getElementById("pageWrapper");
      if (el.classList.contains("center-open")) {
        el.classList.remove("center-open");
        el.classList.add("right-open");
        // el.classList.add("left-open");
      }
    },

    backToLeft() {
      const el = document.getElementById("pageWrapper");
      if (el.classList.contains("center-open")) {
        el.classList.remove("center-open");
        // el.classList.remove("right-open");
        el.classList.add("left-open");
      }
    },

    attachListener(callback) {
      // console.log("attched Listener",callback);
      //  console.log('listner header');
      const listenerID = "UNIQUE_LISTENER_ID_HEADER";
      CometChat.addUserListener(
        listenerID,
        new CometChat.UserListener({
          onUserOnline: (onlineUser) => {
            /* when someuser/friend comes online, user will be received here */
            if (onlineUser.getUid() === this.userData.uid) {
              callback(onlineUser);
              console.log(onlineUser, "isonline");
            }
          },
          onUserOffline: (offlineUser) => {
            /* when someuser/friend went offline, user will be received here */
            if (offlineUser.getUid() === this.userData.uid) {
              callback(offlineUser);
              console.log(offlineUser, "is offline");
            }
          },
        })
      );
    },
    callback(user) {
      console.log(user, "isonlineoffline");
      this.userData = user;
    },
  },

  created() {
    CometChat.getLoggedinUser().then(
      (user) => {
        if (user) {
          if (user.role == "guest") {
            this.isGuest = true;
          } else {
            this.isGuest = false;
          }
        }
      },
      (error) => {
        console.log("yes here", error);
      }
    );
    this.attachListener(this.callback);
  },
};
</script>
<style scoped>
.avatar {
  width: 100%x;
  height: 100%;
  color: #fff;
  font-size: 17px;
  text-align: center;
  border-radius: 50%;
  padding: 5px;
}

.male {
  color: #1871c9;
}
.female {
  color: #db3a16;
}

.cc1-chat-win-header {
  display: grid;
  grid-template-columns: 1fr 500px;
  grid-template-rows: 1fr;
  grid-template-areas: "user banner";
  /* justify-content: space-between; */
  border-bottom: 1px solid #bbb;
}

.cc1-chat-win-user {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  grid-area: user;
}
.signup-banner {
  cursor: pointer;
  background: #97C2C4;
  border-radius: 18px 0 0 18px;
  
  color: #FFF;
  font-size: 16px;
  height: 36px;
  margin: 0;
  padding: 5px;
  padding-left: 15px;
  display: block;
  justify-self: end;
  grid-area: banner;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.signup-banner-link span {
  text-decoration: underline;
}

.back-btn {
  background: url("./../assets/images/svg/arrow_back_icon.svg") no-repeat;
  width: 22px;
  height: 22px;
  text-indent: 9999px;
  background-size: contain;
  display: none;
  vertical-align: middle;
}

@media (min-width: 320px) and (max-width: 767px) {
  .back-btn {
    display: inline-block;
  }
}
@media all and (max-width: 768px) {
  .cc1-chat-win-header {
    padding: 0px;
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
    grid-template-areas:
      "banner"      
      "user";
  }

  .signup-banner {
    border-radius: 0;
    padding: 5px;
    font-size: 16px;    
    width: 100%;            
    grid-area: banner;
  }

  .cc1-chat-win-user {
    padding: 14px 16px;
  }
}
@media all and (max-width: 450px) {
  .signup-banner {
    font-size: 13px;
  }
}
</style>