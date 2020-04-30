import * as AgoraRTC from 'agora-rtc-sdk'
import { initAgora } from './initAgora'

interface OutscaleLive {
  rtcClient: AgoraRTC.Client
  status: 'Playing' | 'Init' | 'Paused'
  lastEventMsg: string | null
  uid: string
  subscribe: any
}

//@ts-ignore
window.liveListen = function(): OutscaleLive {
  const { uid, client } = initAgora('audience')

  return {
    status: 'Init',
    uid: uid,
    rtcClient: client,
    lastEventMsg: null,
    subscribe() {
      let $: OutscaleLive = this

      $.rtcClient.on("stream-added", (evt) => {
        let stream = evt.stream
        console.log("New stream added: " + stream.getId())
        console.log("At " + new Date().toLocaleTimeString())
        console.log("Subscribe ", stream)
    
        $.lastEventMsg = "New stream added: " + stream.getId()
    
        $.rtcClient.subscribe(stream)
      })
      $.rtcClient.on("peer-leave", function(evt) {
        console.log("Peer has left: " + evt.uid)
        console.log(new Date().toLocaleTimeString())
        console.log(evt)
    
        $.lastEventMsg = "Peer has left: " + evt.uid
        // rt.removeStream(evt.uid)
      })
      $.rtcClient.on("stream-subscribed", function(evt) {
        let stream = evt.stream
        console.log("Got stream-subscribed event")
        console.log(new Date().toLocaleTimeString())
        console.log("Subscribe remote stream successfully: " + stream.getId())
        console.log(evt)
        $.lastEventMsg = "Subscribe remote stream successfully: " + stream.getId()
    
        // rt.addStream(stream)
      })
      $.rtcClient.on("stream-removed", function(evt) {
        let stream = evt.stream
        console.log("Stream removed: " + stream.getId())
        console.log(new Date().toLocaleTimeString())
        console.log(evt)
        $.lastEventMsg = "Stream removed: " + stream.getId()
        // rt.removeStream(stream.getId())
      })
    }
  }
}

