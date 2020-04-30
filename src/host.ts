import AgoraRTC from 'agora-rtc-sdk'

interface OutscaleLive {
  rtcClient: AgoraRTC.Client | null
  status: 'Streaming' | 'Init' | 'Paused'
  lastEventMsg: string | null
  uid: string | null
  microphones: MediaStreamTrack[]
  selectedMicrophone: null | MediaStreamTrack
  startStream: any
  localStream: AgoraRTC.Stream | null
  getMicrophones: Function
  initAgora: Function
}

//@ts-ignore
window.liveHost = function(): OutscaleLive {

  return {
    status: 'Init',
    uid: null,
    rtcClient: null,
    lastEventMsg: null,
    selectedMicrophone: null,
    localStream: null,
    microphones: [],
    async getMicrophones() {
      let $: OutscaleLive = this
      const microphones = await navigator.mediaDevices.getUserMedia({ video: false, audio: true })

      $.microphones = microphones.getAudioTracks()
    },

    startStream() {
      let $: OutscaleLive = this

      $.localStream = AgoraRTC.createStream({
        streamID: $.uid!,
        audio: true,
        // @ts-ignore
        audioSource: $.selectedMicrophone,
        video: false,
        screen: false,
      })
      $.localStream.setAudioProfile('high_quality_stereo')
      $.localStream.init(function(){
        $.localStream!.play("local_stream");

        $.status = 'Streaming'

        $.rtcClient!.publish($.localStream!, function(e){
          console.log("publish failed");
        })
      })
    },

    initAgora() {
      let $: OutscaleLive = this
      const appId = 'a62035647b4f46b4acc82a95879f3ed8'
      const channel = 'bliv-i-bilen'

      const client = AgoraRTC.createClient({mode: "live", codec: "h264"})
      client.init(appId, () => {

        // subscribeStreamEvents()

        client.setClientRole('host')

        client.join(null, channel, null, (uid) => {
          console.log("join channel: " + channel + " success, uid: " + uid)
          $.uid = uid as string

        }, function(err) {
          console.error("client join failed", err)
        })
      }, (err) => {
        console.error(err)
      })

      $.rtcClient = client
    }
  }
}

