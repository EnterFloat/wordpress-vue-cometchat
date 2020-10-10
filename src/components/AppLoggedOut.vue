<template>
  <div>
    <div class="center-wrapper">
      <div class="wrapper">
        <h1>Du er logget ud</h1>
        <p>
          Log ind på Blinddaters og genlæs denne side eller deltag som en gæst
        </p>
        <div class="buttons">          
          <input type="button" v-on:click="signin" value="Log ind på Blinddaters"/>
          <input type="button" v-on:click="guest" value="Deltag som gæst" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { CometChat } from "@cometchat-pro/chat";
import { COMETCHAT_CONSTANTS } from "../CONSTS";
import GuestChatContainerVue from '../lib/cometchat-components/components/GuestChatContainer.vue';

export default {
  name: "AppLoggedOut",  
  data() {
    return {
      // showUi: false,
      showloader: false,
      uid: null,
      reloadIntervalLoggedOut: null,
    };
  },
  methods: {
    signin() {
      window.open('https://dev.blinddaters.dk', '_blank');
    },
    guest() {
      this.$router.push({
        name: "GuestChatContainer"
      })
    },    
    loginAndLoadDataLoggedOut() {
      console.log("loginAndLoadDataLoggedOut");
      this.handleAuth(false)
        .then((success) => {
          console.log("Success: " + success);
          // location.href = "#/";
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
.center-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60vh;
}

.wrapper {
  width: 70%;
  margin: 0 auto;
  background: #eee;
  padding: 2rem;
  text-align: center;
}

.buttons {
  padding-top: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 60%;
  margin: 0 auto;
}
.buttons>* {
  margin: 0.5rem;
  background: #DDD;
}

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