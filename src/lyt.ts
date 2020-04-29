import * as AgoraRTC from 'agora-rtc-sdk'
import { config } from './config';

interface Rtc {
  client: null | AgoraRTC.Client
  joined: false
  published: false
  localStream: null
  remoteStreams: []
  params: { uid: null | string | number }
}

(() => {

  console.log('Lyt created')

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

  rtc.client = AgoraRTC.createClient({mode: "live", codec: "h264"});

  // Initialize the client
  rtc.client.init(option.appID, function () {
    console.log("init success");

    rtc.client.setClientRole('audience');

    rtc.client.join(option.token ? option.token : null, option.channel, option.uid ? +option.uid : null, function (uid) {
      console.log("join channel: " + option.channel + " success, uid: " + uid);
      rtc.params.uid = uid;

    }, function(err) {
      console.error("client join failed", err)
    })
  }, (err) => {
    console.error(err);
  })

  rtc.client.on("stream-added", function (evt) {  
    const remoteStream = evt.stream;
    const id = remoteStream.getId();

    if (id !== rtc.params.uid) {
      //@ts-ignore
      rtc.client.subscribe(remoteStream, (err) => {
        console.log("stream subscribe failed", err);
      })
    }
    console.log('stream-added remote-uid: ', id);
  });

  rtc.client.on("stream-subscribed", function (evt) {
    const remoteStream: AgoraRTC.Stream = evt.stream

    console.log('stream-subscribed remote-uid: ', remoteStream.getId())

    remoteStream.stop()
    remoteStream.play('play-element', { muted: false });

    document.addEventListener("touchstart", function(){
      remoteStream.play('play-element', { muted: false });
    });

    document.addEventListener("mousedown", function(){
      remoteStream.play('play-element', { muted: false });
    });

    remoteStream.on('player-status-change', function(evt){
      console.log('my status', evt.reason)
    })

  })
})