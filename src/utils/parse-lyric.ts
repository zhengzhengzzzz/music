export interface ILyric {
  time: number
  text: string
}

// 时间正则表达式
const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/

export const parseLyric = (lyricString: string) => {
  // 1.拿到一行行的歌词
  const lines: string[] = lyricString.split('\n')
  //   2.对每句歌词进行解析 解析对应的对象
  const lyrics: ILyric[] = []
  for (const line of lines) {
    // 1.匹配结果
    const results = timeRegExp.exec(line)
    if (!results) continue

    // 获取每一组的数据
    const time1 = Number(results[1]) * 60 * 1000
    const time2 = Number(results[2]) * 1000
    const time3 =
      results[3].length === 2 ? Number(results[3]) * 10 : Number(results[3])
    const time = time1 + time2 + time3

    // 获取每一组的文本
    const text = line.replace(timeRegExp, '')
    lyrics.push({ time, text })
  }
  return lyrics
}
