import * as AgoraRTC from 'agora-rtc-sdk'
import { initAgora } from './initAgora'

interface OutscaleLive {
  rtcClient: AgoraRTC.Client
  status: 'Playing' | 'Init' | 'Paused'
}

window.outscaleLive = function(): OutscaleLive {
  const client = initAgora('audience')

  client.on("stream-added", (evt) => {
    let stream = evt.stream
    console.log("New stream added: " + stream.getId())
    console.log("At " + new Date().toLocaleTimeString())
    console.log("Subscribe ", stream)

    client.subscribe(stream)
  })
  client.on("peer-leave", function(evt) {
    console.log("Peer has left: " + evt.uid)
    console.log(new Date().toLocaleTimeString())
    console.log(evt)
    // rt.removeStream(evt.uid)
  })
  client.on("stream-subscribed", function(evt) {
    let stream = evt.stream
    console.log("Got stream-subscribed event")
    console.log(new Date().toLocaleTimeString())
    console.log("Subscribe remote stream successfully: " + stream.getId())
    console.log(evt)
    // rt.addStream(stream)
  })
  client.on("stream-removed", function(evt) {
    let stream = evt.stream
    console.log("Stream removed: " + stream.getId())
    console.log(new Date().toLocaleTimeString())
    console.log(evt)
    // rt.removeStream(stream.getId())
  })

  return {
    status: 'Init',
    rtcClient: client
  }
}
