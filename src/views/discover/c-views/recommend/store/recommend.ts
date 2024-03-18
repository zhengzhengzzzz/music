import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getArtistList,
  getBanners,
  getHotRecommend,
  getNewAlbum
} from '../service/recommend'
import { getPlayListDetail } from '@/service/modules/recommend'

export const fetchRecommendDataAction = createAsyncThunk(
  'fetchData',
  (_, { dispatch }) => {
    getBanners().then((res) => {
      dispatch(changeBannersAction(res.banners))
    })
    getHotRecommend(8).then((res) => {
      dispatch(changeHotRecommendAction(res.result))
    })
    getNewAlbum().then((res) => {
      dispatch(changeNewAlbumAction(res.albums))
    })
    getArtistList(5).then((res) => {
      dispatch(changeSettleSingerAction(res.artists))
    })
  }
)

const rankingIds = [19723756, 3779629, 2884035]
export const fetchRankingDataAction = createAsyncThunk(
  'rankingData',
  (_, { dispatch }) => {
    // 方案一:
    // for (const id of rankingIds) {
    //   getPlayListDetail(id).then((res) => {
    //     // console.log(res)
    //     switch (id) {
    //       case 19723756:
    //         console.log('飙升榜', res)
    //         break
    //       case 3779629:
    //         console.log('新歌榜', res)
    //         break
    //       case 2884035:
    //         console.log('原创榜', res)
    //         break
    //     }
    //   })
    // }
    // 方案二:
    // 将三个结果都拿到 统一放到一个数组中管理
    // 保障一：获取所有的结果后 进行dispatch操作
    // 保障二：获取到的结果一定都是有正确顺序的
    const promises: Promise<any>[] = []
    for (const id of rankingIds) {
      promises.push(getPlayListDetail(id))
    }
    Promise.all(promises).then((res) => {
      const playlists = res.map((item) => item.playlist)
      dispatch(changeRankingsAction(playlists))
    })
  }
)

interface IRecommendState {
  banners: any[]
  hotRecommends: any[]
  newAlbums: any[]
  rankings: any[]
  settleSingers: any[]
}

const initialState: IRecommendState = {
  banners: [],
  hotRecommends: [],
  newAlbums: [],
  rankings: [],
  settleSingers: []
}

const recommendSlice = createSlice({
  name: 'recommend',
  initialState,
  reducers: {
    changeBannersAction(state, { payload }) {
      state.banners = payload
    },
    changeHotRecommendAction(state, { payload }) {
      state.hotRecommends = payload
    },
    changeNewAlbumAction(state, { payload }) {
      state.newAlbums = payload
    },
    changeRankingsAction(state, { payload }) {
      state.rankings = payload
    },
    changeSettleSingerAction(state, { payload }) {
      state.settleSingers = payload
    }
  }
})

export const {
  changeBannersAction,
  changeHotRecommendAction,
  changeNewAlbumAction,
  changeRankingsAction,
  changeSettleSingerAction
} = recommendSlice.actions
export default recommendSlice.reducer
