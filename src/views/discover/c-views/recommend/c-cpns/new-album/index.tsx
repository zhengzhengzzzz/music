import React, { memo, useRef } from 'react'
import type { FC, ReactNode, ElementRef } from 'react'
import { NewAlbumWrapper } from './style'
import AreaHeaderV1 from '@/components/area-header-v1'
import { Carousel } from 'antd'
import { useAppSelector } from '@/store'
import { shallowEqual } from 'react-redux'
import NewAlbumItem from '@/components/new-album-item'

interface IProps {
  children?: ReactNode
}
const NewAlbum: FC<IProps> = () => {
  // 定义内部数据
  const bannerRef = useRef<ElementRef<typeof Carousel>>(null)

  // 从redux中获取数据
  const { newAlbums } = useAppSelector(
    (state) => ({
      newAlbums: state.recommend.newAlbums
    }),
    shallowEqual
  )
  //   定义数据处理函数
  function handlePrevClick() {
    bannerRef.current?.prev()
  }
  function handleNextClick() {
    bannerRef.current?.next()
  }
  return (
    <NewAlbumWrapper>
      <AreaHeaderV1 title="新碟上架" moreLink="/discover/album" />
      <div className="content">
        <button
          className="sprite_02 arrow arrow-left"
          onClick={handlePrevClick}
        ></button>
        <div className="album">
          <Carousel dots={false} ref={bannerRef} speed={1500}>
            {[0, 1].map((item) => {
              return (
                <div className="page" key={item}>
                  {newAlbums.slice(item * 5, (item + 1) * 5).map((item) => {
                    return <NewAlbumItem key={item.id} itemData={item} />
                  })}
                </div>
              )
            })}
          </Carousel>
        </div>
        <button
          className="sprite_02 arrow arrow-right"
          onClick={handleNextClick}
        ></button>
      </div>
    </NewAlbumWrapper>
  )
}
export default memo(NewAlbum)
