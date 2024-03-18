import hyRequest from '..'

export function getSongPlayUrl(id: any) {
  return hyRequest.get({
    url: '/song/url',
    params: { id }
  })
}

getSongPlayUrl(123).then((res) => {
  console.log('hhhhhhhhh', res)
})
