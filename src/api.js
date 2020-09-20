import $ from "jquery";
import {COMETCHAT_CONSTANTS} from './CONSTS';
export class RestApi {
  // Get cometchat_data about this user from WP rest api.
  getMeta() {
    try {
      console.log("get_meta");
      if (typeof myScriptVars === "undefined") {
        console.log("myScriptVars undefined");
        return;
      }
      $.ajax({
        method: "POST",
        url: myScriptVars.root + "wordpress-vue-cometchat/meta/get",
        data: { _wpnonce: myScriptVars.nonce },
        dataType: "json",
        success: function(data) {
          console.log(data);
        },
        statusCode: {
          403: function() {
            console.log("Access forbidden");
          }
        }
      });
    } catch (error) {
      console.log("Error: " + error);
    }
  }
  // Update cometchat_data about this user from WP rest api.
  updateMeta(cometchat_data) {
    try {
      console.log("update_meta");
      if (typeof myScriptVars === "undefined") {
        console.log("myScriptVars undefined");
        return;
      }
      console.log(cometchat_data);
      $.ajax({
        method: "POST",
        url: myScriptVars.root + "wordpress-vue-cometchat/meta/update",
        data: {
          cometchat_data: JSON.stringify(cometchat_data),
          _wpnonce: myScriptVars.nonce
        },
        dataType: "json",
        success: function(data) {
          console.log(data);
        },
        statusCode: {
          403: function() {
            console.log("Access forbidden");
          }
        }
      });
    } catch (error) {
      console.log("Error: " + error);
    }
  }

  getUserWith(uid) {
    try {
      console.log("getUserCometChat. uid: " + uid);
      $.ajax({
        method: "GET",
        url: "https://api-eu.cometchat.io/v2.0/users/" + uid,
        
        beforeSend: function(request) {
          request.setRequestHeader("appId", COMETCHAT_CONSTANTS.APP_ID);
          request.setRequestHeader("apiKey", COMETCHAT_CONSTANTS.REST_API_KEY);
          request.setRequestHeader("Content-Type", 'application/json');          
        },
        dataType: "json",
        success: function(data) {
          console.log(data);
        },
        error: function(err) {
            console.log(err)
        },
        statusCode: {
          403: function() {
            console.log("Access forbidden");
          }
        }
      });
    } catch (error) {
      console.log("Error: " + error);
    }
  }
}
