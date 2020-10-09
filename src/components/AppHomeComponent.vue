<template>
  <div>
    <!-- <Loader /> -->
    <h1>Du er logget ud</h1>
    <p>Log ind på Blinddaters og genlæs denne side</p>
  </div>
</template>
<script>
import { CometChat } from "@cometchat-pro/chat";
import { COMETCHAT_CONSTANTS } from "../CONSTS";
import Loader from "./Loader";

export default {
  name: "AppHomeComponent",
  components: {
    Loader,
  },
  data() {
    return {
      // showUi: false,
      showloader: false,
      uid: null,
      reloadIntervalLoggedOut: null,
    };
  },
  methods: {
    login(event, uid) {
      this.showloader = true;
      if (event) {
        event.preventDefault();
      }

      if (uid) {
        this.uid = uid;
      }

      CometChat.login(this.uid, COMETCHAT_CONSTANTS.API_KEY).then((user) => {
        console.log("current log : ", user);
        location.href = "/#";
        this.showloader = false;
      });
    },
    loginAndLoadDataLoggedOut() {
      console.log("loginAndLoadDataLoggedOut");
      this.handleAuth()
        .then((success) => {
          console.log("Success: " + success);
          // location.href = "#/";
          this.showloader = false;
        })
        .catch((error) => {
          console.log("Error: " + error);
        });
    },
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.reloadIntervalLoggedOut);
    next();
  },
  mounted() {
    this.loginAndLoadDataLoggedOut();
    this.reloadIntervalLoggedOut = setInterval(() => {
      this.loginAndLoadDataLoggedOut();
    }, 10000);    
  },
};
</script>

<style scoped>
.userSelector {
  display: flex;
  width: 150px;
  height: 50px;
  margin: auto;
  margin-right: 12.5px;
  margin-left: 12.5px;
  background: #333;
  border-radius: 10px;
  margin-bottom: 10px;
  color: white;
  font-weight: 550;
}

.userSelector:hover {
  cursor: pointer;
  /* color: darken($color: white, $amount: 5%);
  background: darken($color: #333, $amount: 20%); */
}

input {
  border: 2px solid #aaa;
  width: 300px;
  height: 40px;
  border-radius: 10px;
  padding: 5px;
  font-weight: 550;
  color: #555;
}

.loginButton {
  width: 76px;
  height: 40px;
  border-radius: 10px;
  margin: auto;
  margin-top: 10px;
  color: white;
  padding: 10px;
  text-align: center;
  background: #333;
}

.loginButton:hover {
  cursor: pointer;
  /* color: darken($color: white, $amount: 5%);
  background: darken($color: #333, $amount: 20%); */
}
</style>