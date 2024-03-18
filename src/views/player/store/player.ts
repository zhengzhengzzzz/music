import type { IRootState } from '@/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSongDetail, getSongLyric } from '../service/player'
import { ILyric, parseLyric } from '@/utils/parse-lyric'

interface IThunkState {
  state: IRootState
}
// 获取当前歌曲
export const fetchCurrentSongAtion = createAsyncThunk<
  void,
  number,
  IThunkState
>('currentSong', (id, { dispatch, getState }) => {
  // 2种情况
  // 1.从列表尝试是否可以获取到这首歌
  const playSongList = getState().player.playSongList
  const findIndex = playSongList.findIndex((item) => item.id === id)
  if (findIndex === -1) {
    // 没有找到
    // 获取歌曲信息
    getSongDetail(id).then((res) => {
      //  获取song
      if (!res.songs.length) return
      const song = res.songs[0]
      const newPlaySongList = [...playSongList]
      newPlaySongList.push(song)
      dispatch(changeCurrentSongAction(song))
      dispatch(changeSongListAction(newPlaySongList))
      dispatch(changeSongIndexAction(newPlaySongList.length - 1))
    })
  } else {
    // 找到了
    const song = playSongList[findIndex]
    dispatch(changeCurrentSongAction(song))
    dispatch(changeSongIndexAction(findIndex))
  }

  getSongLyric(id).then((res) => {
    // 获取歌词字符串
    const lyricString = res.lrc.lyric
    // 对歌词进行解析
    const lyrics = parseLyric(lyricString)
    // 将歌词放到state中
    dispatch(changeLyricsAction(lyrics))
  })
})

export const changeMusicAction = createAsyncThunk<void, boolean, IThunkState>(
  'changeMusic',
  (isNext, { dispatch, getState }) => {
    // 获取state中的数据
    const player = getState().player
    const playMode = player.playMode
    const songIndex = player.playSongIndex
    const songList = player.playSongList

    // 根据不同的模式计算不同的下一首歌曲的索引
    let newIndex = songIndex
    if (playMode === 1) {
      // 随机播放
      newIndex = Math.floor(Math.random() * songList.length)
    } else {
      // 单曲循环和顺序播放
      newIndex = isNext ? songIndex + 1 : songIndex - 1
      if (newIndex > songList.length - 1) newIndex = 0
      if (newIndex < 0) newIndex = songList.length - 1
    }
    // 获取当前歌曲
    const song = songList[newIndex]
    dispatch(changeCurrentSongAction(song))
    dispatch(changeSongIndexAction(newIndex))

    // 歌词
    getSongLyric(song.id).then((res) => {
      // 获取歌词字符串
      const lyricString = res.lrc.lyric
      // 对歌词进行解析
      const lyrics = parseLyric(lyricString)
      // 将歌词放到state中
      dispatch(changeLyricsAction(lyrics))
    })
  }
)

interface IPlayerState {
  currentSong: any
  lyrics: ILyric[]
  lyricIndex: number
  playSongList: any[]
  playSongIndex: number
  playMode: number
}

const initialState: IPlayerState = {
  currentSong: {},
  lyrics: [],
  lyricIndex: -1,
  playSongIndex: -1,
  playSongList: [],
  playMode: 0 //0:顺序播放 1：随机播放 2：单曲循环
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    changeCurrentSongAction(state, { payload }) {
      state.currentSong = payload
    },
    changeLyricsAction(state, { payload }) {
      state.lyrics = payload
    },
    changeLyricIndexAction(state, { payload }) {
      state.lyricIndex = payload
    },
    changeSongListAction(state, { payload }) {
      state.playSongList = payload
    },
    changeSongIndexAction(state, { payload }) {
      state.playSongIndex = payload
    },
    changePlayModeAction(state, { payload }) {
      state.playMode = payload
    }
  }
})

export const {
  changeCurrentSongAction,
  changeLyricsAction,
  changeLyricIndexAction,
  changeSongIndexAction,
  changeSongListAction,
  changePlayModeAction
} = playerSlice.actions
export default playerSlice.reducer
