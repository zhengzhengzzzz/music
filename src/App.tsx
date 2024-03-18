import React, { Suspense, useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import routes from './router'
import { shallowEqual } from 'react-redux'
import { useAppDispatch, useAppSelector } from './store'
import { changeMessageAction } from './store/modules/counter'
import AppHeader from './components/app-header'
import AppFooter from './components/app-footer'
import AppPlayerBar from './views/player/app-player-bar'
import { fetchCurrentSongAtion } from './views/player/store/player'

function App() {
  // 获取某一喜欢的歌曲
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchCurrentSongAtion(2078080232))
  }, [])

  return (
    <div className="App">
      <AppHeader />
      <Suspense fallback="">
        <div className="main">{useRoutes(routes)}</div>
      </Suspense>
      <AppFooter />
      <AppPlayerBar />
    </div>
  )
}

export default App
