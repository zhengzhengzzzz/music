import { Slider, message } from 'antd'
import React, { memo, useEffect, useRef, useState, useCallback } from 'react'
import type { FC, ReactNode } from 'react'
import {
  AppPlayerBarWrapper,
  BarControl,
  BarOperator,
  BarPlayInfo
} from './style'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/store'
import { shallowEqual, useDispatch } from 'react-redux'
import { formatTime, getImageSize } from '@/utils/format'
import { getSongPlayUrl } from '@/service/modules/player'
import {
  changeLyricIndexAction,
  changeMusicAction,
  changePlayModeAction
} from '../store/player'
import { getPlayUrl } from '@/utils/getPlayUrl'

interface IProps {
  children?: ReactNode
}
const AppPlayerBar: FC<IProps> = () => {
  const dispatch = useAppDispatch()
  // 控制音乐播放与暂停
  const [isplaying, setisplaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  // 控制音乐播放的进度
  const [progress, setProgress] = useState(0)
  // 播放音乐的总时间
  const [duration, setDuration] = useState(0)
  // 播放音乐当前时间
  const [currentTime, setCurrentTime] = useState(0)
  // 歌曲是否拖拽
  const [isSliding, setIsSliding] = useState(false)
  // 从redux中获取数据
  const { currentSong, lyrics, lyricIndex, playMode } = useAppSelector(
    (state) => ({
      currentSong: state.player.currentSong,
      lyrics: state.player.lyrics,
      lyricIndex: state.player.lyricIndex,
      playMode: state.player.playMode
    }),
    shallowEqual
  )
  // 组件内的副作用操作
  useEffect(() => {
    // 播放音乐
    audioRef.current!.src = getPlayUrl(currentSong?.id)
    console.log(audioRef.current!.src)

    audioRef.current
      ?.play()
      .then(() => {
        setisplaying(true)
        console.log('播放歌曲成功')
      })
      .catch((err) => {
        setisplaying(false)
        console.log('播放歌曲失败', err)
      })
    setDuration(currentSong.dt)
  }, [currentSong])
  // 组件内部的事件处理
  // 控制播放器的播放暂停
  function handlePlayBtnClick() {
    isplaying
      ? audioRef.current?.pause()
      : audioRef.current?.play().catch(() => setisplaying(false))
    // 改变isplaying的状态
    setisplaying(!isplaying)
  }
  // const play = useCallback(() => {
  //   isplaying
  //     ? audioRef.current?.pause()
  //     : audioRef.current?.play().catch((err) => {
  //         setisplaying(false)
  //       })
  //   setisplaying(!isplaying)
  // }, [isplaying])
  // 音乐播放进度
  function handleTimeUpdate() {
    // 获取当前的播放时间
    const currentTime = audioRef.current!.currentTime * 1000
    // 计算歌曲的进度
    if (!isSliding) {
      const progress = (currentTime / duration) * 100
      // 设置进度
      setProgress(progress)
      // 设置当前时间
      setCurrentTime(currentTime)
    }
    // 根据当前时间匹配对应的歌词
    let index = lyrics.length - 1
    for (let i = 0; i < lyrics.length; i++) {
      const lyric = lyrics[i]
      if (lyric.time > currentTime) {
        index = i - 1
        break
      }
    }
    // 匹配上对应的歌词的index
    if (index === lyricIndex || index === -1) return
    dispatch(changeLyricIndexAction(index))
    // 展示对应歌词
    message.open({
      content: lyrics[index].text,
      duration: 0,
      key: 'lyric'
    })
  }
  // 点击进度条
  function handleSliderChanged(value: number) {
    console.log('进度条:', value)
    // 获得点击位置的时间
    const currentTime = (value / 100) * duration
    // 设置当前时间
    audioRef.current!.currentTime = currentTime / 1000
    // 记录最新的 currentTime和progress
    setCurrentTime(currentTime)
    setProgress(progress)

    setIsSliding(false)
  }
  // 进度条拖拽
  function handleSliderChanging(value: number) {
    // 目前是拖拽状态
    setIsSliding(true)
    // 设置progress
    setProgress(value)
    // 获取value对应位置的时间
    const currentTime = (value / 100) * duration
    setCurrentTime(currentTime)
  }
  // 切换播放模式
  function handleChangePlayMode() {
    let newPlayMode = playMode + 1
    if (newPlayMode > 2) newPlayMode = 0
    dispatch(changePlayModeAction(newPlayMode))
  }
  // 点击上一首下一首歌曲
  function handleChangeMusic(isNext = true) {
    dispatch(changeMusicAction(isNext))
  }
  // 播放结束
  function handleTimeEnded() {
    if (playMode === 2) {
      audioRef.current!.currentTime = 0
      audioRef.current?.play()
    } else {
      handleChangeMusic(true)
    }
  }
  return (
    <AppPlayerBarWrapper className="sprite_playbar">
      <div className="content wrap-v2">
        <BarControl isplaying={isplaying}>
          <button
            className="btn sprite_playbar prev"
            onClick={() => handleChangeMusic(false)}
          ></button>
          <button
            className="btn sprite_playbar play"
            onClick={handlePlayBtnClick}
          ></button>
          <button
            className="btn sprite_playbar next"
            onClick={() => handleChangeMusic()}
          ></button>
        </BarControl>
        <BarPlayInfo>
          <Link to="/player">
            <img
              className="image"
              src={getImageSize(currentSong?.al?.picUrl, 50)}
              alt=""
            />
          </Link>
          <div className="info">
            <div className="song">
              <span className="song-name">{currentSong.name}</span>
              <span className="singer-name ">{currentSong?.ar?.[0]?.name}</span>
            </div>
            <div className="progress">
              <Slider
                step={0.5}
                tooltip={{ formatter: null }}
                value={progress}
                onAfterChange={handleSliderChanged}
                onChange={handleSliderChanging}
              />
              <div className="time">
                <span className="current">{formatTime(currentTime)}</span>
                <span className="divider">/</span>
                <span className="duration">{formatTime(duration)}</span>
              </div>
            </div>
          </div>
        </BarPlayInfo>
        <BarOperator playmode={playMode}>
          <div className="left">
            <button className="btn pip"></button>
            <button className="btn sprite_playbar favor"></button>
            <button className="btn sprite_playbar share"></button>
          </div>
          <div className="right sprite_playbar">
            <button className="btn sprite_playbar volume"></button>
            <button
              className="btn sprite_playbar loop"
              onClick={handleChangePlayMode}
            ></button>
            <button className="btn sprite_playbar playlist"></button>
          </div>
        </BarOperator>
      </div>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTimeEnded}
      />
    </AppPlayerBarWrapper>
  )
}
export default memo(AppPlayerBar)
