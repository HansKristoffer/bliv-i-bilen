import * as AgoraRTC from 'agora-rtc-sdk'
import { config } from './config';

interface Rtc {
  client: null | AgoraRTC.Client
  joined: false
  published: false
  localStream: AgoraRTC.Stream | null
  remoteStreams: []
  params: { uid: null | string | number }
}


(() => {

  const rtc: Rtc = {
    client: null,
    joined: false,
    published: false,
    localStream: null,
    remoteStreams: [],
    params: {
      uid: null
    }
  };

  // Options for joining a channel
  const option = {
    appID: config.appId,
    channel: config.channel,
    uid: null,
    token: null
  }

  rtc.client = AgoraRTC.createClient({
    mode: "live",
    codec: "h264"
  });


  // Initialize the client
  rtc.client.init(option.appID, function () {
    console.log("init success");

    rtc.client.setClientRole('host');

    rtc.client.join(option.token ? option.token : null, option.channel, option.uid ? +option.uid : null, function (uid) {
      console.log("join channel: " + option.channel + " success, uid: " + uid);
      rtc.params.uid = uid;

      navigator.mediaDevices.getUserMedia(
        {video: false, audio: true}
      ).then(function(mediaStream){
        var audioSources = mediaStream.getAudioTracks()
        console.log("audioSources", audioSources)
        var audioSource = audioSources[0];

        // After processing videoSource and audioSource
        rtc.localStream = AgoraRTC.createStream({
          streamID: rtc.params.uid,
          audio: true,
          // audioSource: audioSource,
          video: false,
          screen: false,
        })
        rtc.localStream.init(function(){
          console.log("init local stream success");

          // play stream with html element id "local_stream"
          rtc.localStream.play("local_stream");

          rtc.client.publish(rtc.localStream, function(e){
            console.log("publish failed");
            console.error(e);
          });
        });
      });
    }, function(err) {
      console.error("client join failed", err)
    })

  }, (err) => {
    console.error(err);
  })
  
})