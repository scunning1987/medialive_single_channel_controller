/*
* HTML5 Motion Graphics Javascript file
* Author: Scott Cunningham
*/

var sldpPlayers = [];

function showControlSubMenu(evt, menuItem) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(menuItem).style.display = "block";
  evt.currentTarget.className += " active";

  if ( menuItem == "switch-input" ) {
      console.log("Selected tab is " + menuItem + " need to run function to get available inputs/sources ")
      // s3 api call
      s3getObjectsAPI(bucket, apiendpointurl)
      getLiveInputs(apiendpointurl)
    }

}


function pageLoadFunction(){

  getConfig();

  console.log("channel map : " + JSON.stringify(live_event_map))
  console.log("vod bucket: " + bucket)

  // Populate the static dropdown elements with data obtained from the channel map json
  //bumperDropdownPopulate()
    let dropdown = document.getElementById('gfx_overlay_selection');
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Select A Graphic';
    defaultOption.value = "";

    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

  for (gfx_item in gfx_overlay_items){

        option = document.createElement('option');
        option.text = gfx_overlay_items[gfx_item].name;
        option.value = gfx_overlay_items[gfx_item].url;
        dropdown.add(option);
    }

  var myVideo = videojs('my-video');
      myVideo.src([
          {type: "application/x-mpegURL", src: live_event_map["1"]["hls_url"]}
      ]);

    pipSelector = "1"
    channelState()
}

function chstartstopcontrol(action_type){
  console.log("Running Channel Start/Stop function")
  if ( pipSelector == "" ) {
    console.log("Operator has not selected a channel thumbnail. Select a thumbnail first before an action can be performed")
    alert("Please select a channel thumbnail first!")
  } else {
  if (window.confirm("Do you really want to "+action_type+" this channel?")) {

      document.getElementById(action_type).classList.add('pressedbutton');
      console.log("action type: "+action_type+" for channel ID : "+live_event_map[pipSelector].primary_channel_id)
      // API Call to start/stop channel
//      channelStartStop(action_type)

      // enable or disable html5
      var html5_duration = 10
      if (action_type == "start"){
        html5_duration = 0
      }

      html5settings = {
            "type":"html5activate",
            "duration":html5_duration,
            "url":live_event_map[pipSelector].html5_graphics_url,
            "html5_apiendpoint_ctrl": live_event_map[pipSelector].html5_graphics_ctrl
          }
          html5settings_b64 = btoa(JSON.stringify(html5settings))
          switchtype = "html5Activate"
          channelid = live_event_map[pipSelector].primary_channel_id
          emlSwitchAction(html5settings_b64, channelid, "bucket", switchtype, "", 200, "master", html5settings_b64)

      // reset styling on the pip now that the action has been performed
      channelStartStop(action_type)
      fadeAway(action_type)
    }
  }
}

function chliveswitch() {
  console.log("Running Live input switch function")
  if ( pipSelector == "" ) {
    console.log("Operator has not selected a channel thumbnail. Select a thumbnail first before an action can be performed")
    alert("Please select a channel thumbnail first!")
  } else {
  document.getElementById('live').classList.add('pressedbutton');
  input = document.getElementById("live_source_dropdown_select").value
  console.log("Switching to input: "+input+" for channel ID : "+live_event_map[pipSelector].primary_channel_id)
  channelid = live_event_map[pipSelector].primary_channel_id + ":" + live_event_map[pipSelector].channel_region
  emlSwitchAction(input, channelid, "", "immediateSwitchLive", "", 200, "master", "immediateswitch")
  }

  // reset styling on the pip now that the action has been performed
  fadeAway('live')
}

var fadeAway = function(buttonid) {
  setTimeout(function(){
  document.getElementById(buttonid).classList.remove('pressedbutton');
 }, 4000);
}

setInterval(function() {

  if ( pipSelector !== "" ) {
    channelState(pipSelector)
  }

}, 5000);

function chvodswitch(switchtype){
  console.log("Running VOD input switch function")

  if ( pipSelector == "" ) {
    console.log("Operator has not selected a channel thumbnail. Select a thumbnail first before an action can be performed")
    alert("Please select a channel thumbnail first!")
  } else {
      if ( switchtype == "immediateSwitch" ) {
        document.getElementById('vod').classList.add('pressedbutton');
        input = document.getElementById("vod_source_dropdown_select").value
      } else {
        document.getElementById('vod_continue').classList.add('pressedbutton');
        input = document.getElementById("vod_source_dropdown_select_continue").value
      }
      if ( input == "" ){
        alert("Please select a file to play...")
        document.getElementById('vod').classList.remove('pressedbutton');
        document.getElementById('vod_continue').classList.remove('pressedbutton');

      } else {

      console.log("Switching to input: "+input+" for channel ID : "+live_event_map[pipSelector].primary_channel_id)
      channelid = live_event_map[pipSelector].primary_channel_id + ":" + live_event_map[pipSelector].channel_region
      emlSwitchAction(input, channelid, bucket, switchtype, "", 200, "master", switchtype)


      fadeAway('vod')
      fadeAway('vod_continue')
      }

    }
}

function gfx_overlay(actiontype){
  console.log("Invoking Graphic overlay: " + actiontype);

  var oktoinsert = true;

  // Get the property values to make the api call.
  var gfx_url =  document.getElementById("gfx_overlay_selection").value;
  var gfx_position = document.getElementById("gfx_overlay_position").value;
  var gfx_duration = document.getElementById("durationinput").value;

//  var timenow = Math.floor(parseInt(Date.now()) / 1000);
//
//  // channel status
//  reservation_end_time = reservations[pip]["reservation_end_time"];
//
//  if ( reservation_end_time > timenow ) {
//    // we can do graphics!
//    timeleft = reservation_end_time - timenow;
//
//    if ( gfx_duration == 0 || gfx_duration > timeleft ) {
//      gfx_duration = timeleft;
//    }
//
//  } else {
//    console.log("The channel is not reserved, so we're not going to put up graphics");
//    oktoinsert = false;
//  }


  var gfx_fade = document.getElementById("gfx_overlay_fade").value;
  var x = 0;
  var y = 0;

  switch(gfx_position) { // x 640 y 360
    case "1":
      x = 20;
      y = 20;
      break;
    case "2":
      x = 1100;
      y = 20;
      break;
    case "3":
      x = 20;
      y = 600;
      break;
    case "4":
      x = 1100;
      y = 600;
      break;
    default:
      x = 20;
      y = 20;
  }


  if ( gfx_url == "" && actiontype == "activate" ) {
    alert("WARNING: Please select a graphic to insert!");
    oktoinsert = false;
  }
  if ( gfx_duration != parseInt(gfx_duration) ) {
    alert("WARNING: Please enter a valid value for duration");
    oktoinsert = false;
  }

  if ( oktoinsert ) {
  console.log("inserting gfx overlay")

      if ( actiontype == "activate" ){
        switchtype = "gfxActivate";
        document.getElementById('gfx_on').classList.add('pressedbutton');
        gfx_url_no_protocol = gfx_url.replace("https://","")
      } else {
        switchtype = "gfxDeactivate"
        document.getElementById('gfx_off').classList.add('pressedbutton');
        gfx_url_no_protocol = "";
      }

      // send to function
      channelid = live_event_map[pipSelector].primary_channel_id

      // gfx_settings = x,y,duration,fade
      gfx_settings = x + "," + y + "," + gfx_duration + "," + gfx_fade
      emlSwitchAction(gfx_url_no_protocol, channelid, "bucket", switchtype, "", 200, "master", gfx_settings)

      fadeAway('gfx_on')
      fadeAway('gfx_off')
  }

}

function html5(type,onoff) {

  var html5buttons = [ 'html5_ticker_on', 'html5_ticker_off', 'html5_score_update_score1', 'html5_score_update_score2','html5_score_update_matchstart','html5_score_update_matchstop','html5_score_update_matchreset','html5_score_on','html5_score_off','html5_lthird_on','html5_lthird_off','html5_socialbug_on','html5_socialbug_off' ];

  var html5settings = {}
  if ( type == "ticker" ) {
    console.log("html5 overlay type: " + type);
    ticker_text = document.getElementById("tickerstring").value;
    ticker_title = document.getElementById("tickertitle").value;
    ticker_speed = document.getElementById("ticker_speed").value;


    html5settings = {
      "type":"ticker",
      "onoff":onoff,
      "ticker_title":ticker_title,
      "ticker_text":ticker_text,
      "ticker_speed":ticker_speed
    }

    if ( onoff == 'activate' ) {
      document.getElementById('html5_ticker_on').classList.add('pressedbutton');
    } else {
      document.getElementById('html5_ticker_off').classList.add('pressedbutton');
    }


  } else if ( type.includes("score") ){
    console.log("html5 overlay type: " + type);
    team_1_name = document.getElementById("team_1_name").value;
    team_2_name = document.getElementById("team_2_name").value;
    team_1_score = document.getElementById("team_1_score").value;
    team_2_score = document.getElementById("team_2_score").value;

    if (type == 'score' || type == 'score-matchcontrolreset') {
      match_clock_control = 'reset';
    } else if ( type == 'score-matchcontrolstart' ) {
      match_clock_control = 'start';
    } else {
      match_clock_control = 'pause';
    }

    match_clock_start = document.getElementById("match_clock_start").value;
    match_half = document.getElementById("match_half").value;

    if (!match_clock_start.match("[0-9]{2}:[0-9]{2}$")){
      console.log("Clock time not in the correct format, defaulting to 00:00")
      document.getElementById("match_clock_start").value = "00:00";
    }

    html5settings = {
          "type":type,
          "onoff":onoff,
          "team_1_name":team_1_name,
          "team_2_name":team_2_name,
          "team_1_score":team_1_score,
          "team_2_score":team_2_score,
          "match_clock_start":match_clock_start,
          "match_clock_control":match_clock_control,
          "match_half":match_half
        }

    if ( type == 'score-score1update' ) {
          document.getElementById('html5_score_update_score1').classList.add('pressedbutton');
        } else if ( type == 'score-score2update' ) {
          document.getElementById('html5_score_update_score2').classList.add('pressedbutton');
        } else if ( type == 'score-matchcontrolstart' ) {
          document.getElementById('html5_score_update_matchstart').classList.add('pressedbutton');
        } else if ( type == 'score-matchcontrolstop' ) {
            document.getElementById('html5_score_update_matchstop').classList.add('pressedbutton');
        } else if ( type == 'score-matchcontrolreset' ) {
            document.getElementById('html5_score_update_matchreset').classList.add('pressedbutton');
        } else if ( type == 'score' && onoff == 'activate' ) {
            document.getElementById('html5_score_on').classList.add('pressedbutton');
        } else if ( type == 'score' && onoff == 'deactivate' ) {
            document.getElementById('html5_score_off').classList.add('pressedbutton');
        } else {
            console.log("not sure what button was pressed")
        }

  } else if ( type == "lthird" ) {
    console.log("html5 overlay type: " + type);
    line_1_text = document.getElementById("lthird_line_1").value;
    line_2_text = document.getElementById("lthird_line_2").value;

    html5settings = {
          "type":"lthird",
          "onoff":onoff,
          "line_1_text":line_1_text,
          "line_2_text":line_2_text
        }

    if ( onoff == 'activate' ) {
      document.getElementById('html5_lthird_on').classList.add('pressedbutton');
    } else {
      document.getElementById('html5_lthird_off').classList.add('pressedbutton');
    }

  } else {
    // this is the social bug overlay section
    console.log("html5 overlay type: " + type);
    social_url = document.getElementById("social_url").value;
    social_text = document.getElementById("social_text").value;

    html5settings = {
          "type":"social-bug",
          "onoff":onoff,
          "social_url":social_url,
          "social_text":social_text
        }

      if ( onoff == 'activate' ) {
        document.getElementById('html5_socialbug_on').classList.add('pressedbutton');
      } else {
        document.getElementById('html5_socialbug_off').classList.add('pressedbutton');
      }

  }

  html5settings.html5_endpoint = live_event_map[pipSelector].html5_graphics_ctrl;
  html5settings_b64 = btoa(JSON.stringify(html5settings));
  switchtype = "html5Graphics";
  channelid = live_event_map[pipSelector].primary_channel_id;
  emlSwitchAction(html5settings_b64, channelid, "bucket", switchtype, "", 200, "master", html5settings_b64);

  for ( var i = 0; i < html5buttons.length; i++ ) {
    fadeAway(html5buttons[i]);
  }

}

function chreserve(){
  // first check if a name is present
  var alias = document.getElementById("aliasbox").value;
  if ( alias == "" ){

    alert("Please enter a name for the reservation");

  } else {

      document.getElementById('reserve').classList.add('pressedbutton');
      fadeAway('reserve');
      channelReservation('makeReservation');

      // Check if it was successful
      var STATUS = reservations['status'];
      var MESSAGE = reservations['message'];
      var html5_endpoint = live_event_map[pipSelector].html5_graphics_url;

      alert(STATUS + " ... " + MESSAGE);

      if ( STATUS == "SUCCESS" ) {
        // now channel is reserved we need to activate HTML5 graphics engine
        var reservation_duration = parseInt(document.getElementById("reservation_duration").value) * 1000;
        // html5_endpoint variable pulled from channel_map.json

        html5settings = {
          "type":"html5activate",
          "duration":reservation_duration,
          "url":html5_endpoint,
          "html5_apiendpoint_ctrl": live_event_map[pipSelector].html5_graphics_ctrl
        }
        html5settings_b64 = btoa(JSON.stringify(html5settings))
        switchtype = "html5Activate"
        channelid = live_event_map[pipSelector].primary_channel_id
        emlSwitchAction(html5settings_b64, channelid, "bucket", switchtype, "", 200, "master", html5settings_b64)

      }
  }
}

////
//// API CALL SECTION
////

///// Get Channel Map JSON

function getConfig(){
  var json_data,
  current_url = window.location.href
  json_endpoint = current_url.substring(0,current_url.lastIndexOf("/")) + "/channel_map.json"

  var request = new XMLHttpRequest();
  request.open('GET', json_endpoint, false);

  request.onload = function() {

  if (request.status === 200) {
    const jdata = JSON.parse(request.responseText);
    console.log(jdata)
    window.live_event_map = jdata.channel_map
    window.bucket = jdata.vod_bucket
    window.bumper_bucket_region = jdata.bumper_bucket_region
    window.apiendpointurl = jdata.control_api_endpoint_url
    window.gfx_overlay_items = jdata.gfx_overlay
    json_data = request.responseText
     } else {
    // Reached the server, but it returned an error
  }
}

request.onerror = function() {
  console.error('An error occurred fetching the JSON from ' + json_endpoint);
};

request.send();
return json_data
}

/////

///// Channel Start/Stop

function channelStartStop(startstop){

    if (pipSelector.length < 1){
      alert("Select a channel first...");
      return;
    }

    //channels = [ live_event_map[pipSelector].proxy_gen_channel , live_event_map[pipSelector].primary_channel_id ];
    channels = [ live_event_map[pipSelector].primary_channel_id ];

    for ( i in channels ) {

        console.log("channel start-stop action api call: initializing")
        console.log("performing api action on channel id : " + channels[i])
        channelid = channels[i] + ":" + live_event_map[pipSelector].channel_region;

        var param1 = "awsaccount=master";
        var param2 = "&functiontorun=channelStartStop"
        var param3 = "&channelid="+channelid;
        var param4 = "&maxresults=200";
        var param5 = "&bucket=bucket:path/key.mp4";
        var param6 = "&input="+startstop;
        var param7 = "&follow=";
        var param8 = "&duration=";
        var url = apiendpointurl+"?"+param1+param2+param3+param4+param5+param6+param7+param8
        console.log("channel start-stop action api call - executing : " + channelid)

        var putReq = new XMLHttpRequest();
        putReq.open("PUT", url, false);
        putReq.setRequestHeader("Accept","*/*");
        putReq.send();

    }
    alert("Channel state is changing, please be patient. This may take 60-90 seconds")
}

/////

///// MediaLive Switch Action (LIVE AND VOD)

function emlSwitchAction(file, channelid, bucket, takeType, follow, maxresults, awsaccount, scte){


        //    if ( takeType.includes("html5") || takeType.includes("gfx")) {
        //        channels = [ live_event_map[pipSelector].primary_channel_id ];
        //    } else {
        //        channels = [ live_event_map[pipSelector].proxy_gen_channel , live_event_map[pipSelector].primary_channel_id ];
        //    }
        channels = [ live_event_map[pipSelector].primary_channel_id ];
        for ( i in channels ) {

            console.log("eml switch action api call: initializing")
            console.log("Executing API PUT action for switch type "+takeType)
            console.log("performing api action on channel id : " + channels[i])
            channelid = channels[i] + ":" + live_event_map[pipSelector].channel_region;

            var param1 = "awsaccount="+awsaccount;
            var param2 = "&functiontorun="+takeType
            var param3 = "&channelid="+channelid;
            var param4 = "&maxresults="+maxresults;
            var param5 = "&bucket="+bucket;
            var param6 = "&input="+file;
            var param7 = "&follow="+follow;
            var param8 = "&duration="+scte;
            var url = apiendpointurl+"?"+param1+param2+param3+param4+param5+param6+param7+param8
            console.log("eml switch action api call - executing : "+url)

            var putReq = new XMLHttpRequest();
            putReq.open("PUT", url, false);
            putReq.setRequestHeader("Accept","*/*");
            putReq.send();
            var timenow = new Date().toTimeString()
        }
}

/////

///// channel state
function channelState() {
    console.log("channel state api call: initializing")
    var channellist = [];
    var channelid = live_event_map[pipSelector].primary_channel_id  + ":" + live_event_map[pipSelector].channel_region

    var param1 = "awsaccount=master";
    var param2 = "&functiontorun=describeChannelState"
    var param3 = "&channelid="+channelid; // this needs to be full list of channel id's and regions
    var param4 = "&maxresults=200";
    var param5 = "&bucket=";
    var param6 = "&input=";
    var param7 = "&follow=";
    var url = apiendpointurl+"?"+param1+param2+param3+param4+param5+param6+param7

    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status === 200) {
        var state_data = JSON.parse(request.responseText);
        console.log("channel state api call response : " + JSON.stringify(state_data))
        document.getElementById('channel_status').innerHTML = '<h5>Channel Status: '+state_data.status+'</h5>'
       } else {
         error_message = "Unable to get channel status"
         document.getElementById('channel_status').innerHTML = '<h5>Channel Status: '+error_message+'</h5>'
        // Reached the server, but it returned an error
      }
    }
    request.onerror = function() {
      console.error('An error occurred fetching the JSON from ' + url);
    };

    request.send();
}

/////

///// EML GET ATTACHED INPUTS - START

function getLiveInputs(apiendpointurl) {
    console.log("get live inputs api call: initializing")
    var channelid = live_event_map[pipSelector].primary_channel_id + ":" + live_event_map[pipSelector].channel_region;
    var input = document.getElementById("live_source_dropdown_select").value;

    var param1 = "awsaccount=master";
    var param2 = "&functiontorun=getAttachedInputs"
    var param3 = "&channelid="+channelid;
    var param4 = "&maxresults=200";
    var param5 = "&bucket=";
    var param6 = "&input="+input;
    var param7 = "&follow=";

    var url = apiendpointurl+"?"+param1+param2+param3+param4+param5+param6+param7
    console.log("Executing API call to get attached inputs to MediaLive Channel " + channelid )

    let dropdown = document.getElementById('live_source_dropdown_select');
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose Live Source';

    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        console.log("get live inputs api call response : " + data)
        let option;
        for (let i = 0; i < data.length; i++) {
          option = document.createElement('option');
          option.text = data[i].name;
          option.value = data[i].name;
          dropdown.add(option);
        }
       } else {
        // Reached the server, but it returned an error
      }
    }
    request.onerror = function() {
      console.error('An error occurred fetching the JSON from ' + url);
    };

    request.send();
}

/////

///// S3 GET OBJECT API CALL - START

function s3getObjectsAPI(bucket, apiendpointurl) {
    console.log("s3 get objects api call: initializing")
    var param1 = "awsaccount=master";
    var param2 = "&functiontorun=s3GetAssetList"
    var param3 = "&channelid=0:x";
    var param4 = "&maxresults=200";
    var param5 = "&bucket="+bucket;
    var param6 = "&input=";
    var param7 = "&follow=";
    var url = apiendpointurl+"?"+param1+param2+param3+param4+param5+param6+param7
    console.log("Executing API Call to get S3 assets: " +url )

    let dropdown = document.getElementById('vod_source_dropdown_select');
    let dropdown_continue = document.getElementById('vod_source_dropdown_select_continue');

    dropdown.length = 0;
    dropdown_continue.length = 0;

    let defaultOption = document.createElement('option');
    let defaultOption_continue = document.createElement('option');

    defaultOption.text = 'Choose Asset';
    defaultOption.value = '';
    defaultOption_continue.text = 'Choose Asset';
    defaultOption_continue.value = '';

    dropdown.add(defaultOption);
    dropdown_continue.add(defaultOption_continue);
    dropdown.selectedIndex = 0;
    dropdown_continue.selectedIndex = 0;

    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
      if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        console.log("s3 get objects api call response: " + data)
        let option;
        for (let i = 0; i < data.length; i++) {
          option = document.createElement('option');
          option.text = data[i].name;
          option.value = data[i].key;
          if ( data[i].key.includes("Bumpers/") ) {
            dropdown_continue.add(option);
          } else if ( data[i].key.includes("MP4Assets/") ) {
            dropdown.add(option);
          }
        }
       } else {
        // Reached the server, but it returned an error
        console.log("something went wrong getting the assets from S3")
      }
    }

    request.onerror = function() {
      console.error('An error occurred fetching the JSON from ' + url);
    };

    request.send();
}

/////

///// channelReservation

function channelReservation(calltype){
    console.log("channel reservations: initializing for call type " + calltype)
    if ( calltype == "reservationsCheck" ){
      var channelid = "1,2,3,4"
      var alias = "checker";
      var res_time = "0";
    } else {
      var channelid = pip;
      var alias = document.getElementById("aliasbox").value;
      var timenow = Math.floor(parseInt(Date.now()) / 1000);
      var res_length = document.getElementById("reservation_duration").value;
      var res_time = timenow + parseInt(res_length);
    }

    var param1 = "awsaccount=master";
    var param2 = "&functiontorun=channelReservation"
    var param3 = "&channelid="+channelid;
    var param4 = "&maxresults=200";
    var param5 = "&bucket="+alias;
    var param6 = "&input="+calltype;
    var param7 = "&follow="+res_time;
    var url = apiendpointurl+"?"+param1+param2+param3+param4+param5+param6+param7
    console.log("Executing API Call for channel reservations: " +url )

  var request = new XMLHttpRequest();
  request.open('GET', url, false);

  request.onload = function() {

  if (request.status === 200) {
    const jdata = JSON.parse(request.responseText);
    console.log(jdata)
    window.reservations = jdata

     } else {
    // Reached the server, but it returned an error
  }
}

request.onerror = function() {
  console.error('An error occurred fetching the JSON from ' + url);
};

request.send();
}

/////