import $ from "jquery";
import { COMETCHAT_CONSTANTS } from "./CONSTS";
import { CometChat } from "@cometchat-pro/chat";
import EventBus from "./lib/cometchat-components/components/event-bus.js";

export class RestApi {
  // Get id of logged in CometChat user
  async getUserId() {
    return new Promise((resolve, reject) => {
      CometChat.getLoggedinUser().then(usr => {
        if (typeof usr !== "undefined") {
          return resolve(usr.uid);
        } else {
          return reject("Could not get user id");
        }
      });
    });
  }

  // Perform ajax request
  async APICall(options) {
    return new Promise((resolve, reject) => {
      try {
        $.ajax({
          method: options.callType,
          url: options.url,
          data: options.data,
          dataType: "json",
          beforeSend: function(request) {
            if (typeof options.headers === "undefined") return;
            options.headers.forEach(header => {
              request.setRequestHeader(header.key, header.value);
            });
          },          
          success: function(data) {
            return resolve(data);
          },
          error: function(err) {
            console.log(err);
            return reject(err);
          },
          statusCode: {
            403: function() {
              return reject("Access forbidden");
            }
          }
        });
      } catch (error) {
        return reject(error);
      }
    });
  }
  // Get cometchat_data about this user from the WP rest api
  async getMeta() {
    console.log("myScriptVars.nonce");
    return new Promise((resolve, reject) => {
      console.log(myScriptVars.nonce);
      if (typeof myScriptVars === "undefined")
        return reject("myScriptVars undefined");
      console.log(myScriptVars.nonce);
      this.APICall({
        callType: "POST",
        url: myScriptVars.root + "wordpress-vue-cometchat/meta/get",
        data: {
          _wpnonce: myScriptVars.nonce
        }
      })
        .then(data => {
          return resolve(data);
        })
        .catch(() => {
          return reject("error");
        });
    });
  }
  // Update cometchat_data about this user from WP rest api
  async updateMeta(cometchat_data) {
    return new Promise((resolve, reject) => {
      console.log("myScriptVars.nonce");
      console.log(myScriptVars.nonce);
      if (typeof myScriptVars === "undefined")
        return reject("myScriptVars undefined");
      console.log(myScriptVars.nonce);
      console.log("Passed myScriptVars");
      this.APICall({
        callType: "POST",
        url: myScriptVars.root + "wordpress-vue-cometchat/meta/update",
        data: {
          cometchat_data: cometchat_data,
          _wpnonce: myScriptVars.nonce
        }
      })
        .then(data => {
          return resolve(data);
        })
        .catch(() => {
          return reject("error");
        });
    });
  }

  // Get CometChat user
  async ccGetUser() {
    return new Promise((resolve, reject) => {
      this.getUserId()
        .then(uid => {
          return this.APICall({
            callType: "GET",
            url: "https://api-eu.cometchat.io/v2.0/users/" + uid,
            headers: [
              { key: "appId", value: COMETCHAT_CONSTANTS.APP_ID },
              { key: "apiKey", value: COMETCHAT_CONSTANTS.REST_API_KEY },
              { key: "Content-Type", value: "application/json" }
            ]
          });
        })
        .then(data => {
          return resolve(data);
        })
        .catch(() => {
          return reject("error");
        });
    });
  }
  // Add friend
  async ccAddFriends(uids) {
    return new Promise((resolve, reject) => {
      this.getUserId()
        .then(uid => {
          return this.APICall({
            callType: "POST",
            url: "https://api-eu.cometchat.io/v2.0/users/" + uid + "/friends",
            data: JSON.stringify({ accepted: uids }),
            headers: [
              { key: "appId", value: COMETCHAT_CONSTANTS.APP_ID },
              { key: "apiKey", value: COMETCHAT_CONSTANTS.REST_API_KEY },
              { key: "Content-Type", value: "application/json" }
            ]
          });
        })
        .then(data => {
          EventBus.$emit("update-users-list", data);
          return resolve(data);
        })
        .catch(() => {
          return reject("error");
        });
    });
  }

  // Remove friend
  async ccRemoveFriends(uids) {
    return new Promise((resolve, reject) => {
      this.getUserId()
        .then(uid => {
          return this.APICall({
            callType: "DELETE",
            url: "https://api-eu.cometchat.io/v2.0/users/" + uid + "/friends",
            data: JSON.stringify({ friends: uids }),
            headers: [
              { key: "appId", value: COMETCHAT_CONSTANTS.APP_ID },
              { key: "apiKey", value: COMETCHAT_CONSTANTS.REST_API_KEY },
              { key: "Content-Type", value: "application/json" }
            ]
          });
        })
        .then(data => {
          EventBus.$emit("update-users-list", data);
          return resolve(data);
        })
        .catch(() => {
          return reject("error");
        });
    });
  }
}
