<template>
  <div>
    <div class="cc1-chat-win-header clearfix" v-if="userData.uid || userData.guid">
      <!-- For user -->
      <div class="cc1-chat-win-user">
        <div v-if="showBackArrow">
        <a href="javascript:;" class="back-btn" v-on:click="backToLeft()">&nbsp;</a>
        </div>
        <div class="cc1-chat-win-user-thumb">
          <img v-if="userData.avatar" :src="userData.avatar" />
          <img v-else-if="userData.icon" :src="userData.icon" />
          <div class="avatar" v-bind:style= "{'background-color': randomcolor()}" v-else>{{userData.name.charAt(0).toLowerCase()}}</div>
        </div>

        <div class="cc1-chat-win-user-name-wrap">
          <h6 v-if="userData.metadata" :class="userData.metadata.gender" class="cc1-chat-win-user-name">{{userData.name}}</h6>
          <h6 v-else class="cc1-chat-win-user-name">{{userData.name}}</h6>
          <span
            class="cc1-chat-win-user-status ccl-blue-color"
            v-if="userData.status !=='offline'"
          >{{userData.status}}</span>
          <span
            class="cc1-chat-win-user-status"
            v-else-if="userData.status === 'offline' && userData.lastActiveAt"
          >Sidst aktiv: {{getDate(userData.lastActiveAt)}}</span>
        </div>
      </div>
      <div class="cc1-chat-win-con-opt-wrap">
        <input type="button" v-on:click="signup" value="Opret dig på Blinddaters"/>
        <!-- <a href="javascript:void(0);" class="cc1-chat-win-con-opt call" v-on:click="makeAudioCall($event)"></a> -->
        <!-- <a href="javascript:void(0);" class="cc1-chat-win-con-opt video-call" v-on:click="makeVideoCall($event)"></a> -->
        <!-- <a href="javascript:void(0);" class="cc1-chat-win-con-opt details" v-on:click="clickMenuOption()"></a> -->
      </div>
    </div>
  </div>
</template>

<script>
import { CometChat } from "@cometchat-pro/chat";

export default {
  name: "MessageHeader",
  data() {
    return {
      menuOption: false,
      userData: {},
      displayBackArrow: false
    };
  },
  // props:['userData'],

  mounted() {
    this.$root.$on("selectedUser", data => {
      this.userData = data;
    });
  },
  
  methods: {
    signup() {
      window.open('https://dev.blinddaters.dk', '_blank');
    },
    getDate(datetime) {
      let date = new Date(datetime * 1000);
      return date.toLocaleTimeString();
    },

    randomcolor: () => {
      let color = Math.floor(0x1000000 * Math.random()).toString(16)
      let bgcolor ='#' + ('000000' + color).slice(-6);
      return bgcolor;
    },

    makeAudioCall(event) {
      console.log('Audio call', event);
    },

    makeVideoCall(event) {
      console.log('Video call', event);
    },

    clickMenuOption() {
      this.menuOption = !this.menuOption;
      this.$root.$emit('menuOpen', this.menuOption);

      const el  = document.getElementById('pageWrapper');
      if (el.classList.contains("center-open")) {
        el.classList.remove("center-open");
        el.classList.add("right-open");
        // el.classList.add("left-open");
      }
    },

    backToLeft() {
      const el  = document.getElementById('pageWrapper');
      if (el.classList.contains("center-open")) {
        el.classList.remove("center-open");
        // el.classList.remove("right-open");
        el.classList.add("left-open");
      }      
    },

    attachListener(callback) {
      // console.log("attched Listener",callback);
      //  console.log('listner header');
        const listenerID = 'UNIQUE_LISTENER_ID_HEADER';
        CometChat.addUserListener(
            listenerID,
            new CometChat.UserListener({
                onUserOnline: (onlineUser) => {
                    /* when someuser/friend comes online, user will be received here */
                    if (onlineUser.getUid() === this.userData.uid) {
                        callback(onlineUser);
                        console.log(onlineUser, 'isonline');
                    }
                },
                onUserOffline: (offlineUser) => {
                    /* when someuser/friend went offline, user will be received here */
                    if (offlineUser.getUid() === this.userData.uid) {
                        callback(offlineUser);
                        console.log(offlineUser, 'is offline');
   
                    }
                }
            })
        );
    },
    callback(user) {
      console.log(user, 'isonlineoffline');
      this.userData = user;
    }
  },

  created() {
    CometChat.getLoggedinUser().then(
      (user) => {
        if (user) {
          if (user.role == "guest") {
            this.showBackArrow = false;
          } else {
            this.showBackArrow = true;
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
  font-size: 18px;
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

.back-btn {
  background: url('./../assets/images/svg/arrow_back_icon.svg') no-repeat;
  width: 22px;
  height: 22px;
  text-indent: 9999px;
  background-size: contain;
  display: none;
  vertical-align: middle;
}


@media (min-width : 320px) and (max-width : 767px) {
  .back-btn {
    display: inline-block;
  }
}




</style>