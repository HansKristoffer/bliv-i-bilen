import * as AgoraRTC from 'agora-rtc-sdk'

export function initAgora(role: "audience" | "host") {
  const appId = 'a62035647b4f46b4acc82a95879f3ed8'
  const channel = 'bliv-i-bilen'
  let uid: string = ''

  const client = AgoraRTC.createClient({mode: "live", codec: "h264"})
  client.init(appId, () => {
    console.log("init success")

    // subscribeStreamEvents()

    client.setClientRole(role)

    client.join(null, channel, null, (uid) => {
      console.log("join channel: " + channel + " success, uid: " + uid)
      uid = uid
      console.log("initAgora -> uid", uid)

    }, function(err) {
      console.error("client join failed", err)
    })
  }, (err) => {
    console.error(err)
  })

  return {
    uid,
    client
  }
}