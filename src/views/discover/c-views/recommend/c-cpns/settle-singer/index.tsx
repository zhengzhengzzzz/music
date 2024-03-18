import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { SettleSingerWrapper } from './style'
import AreaHeaderV2 from '@/components/area-header-v2'
import { useAppSelector } from '@/store'
import { shallowEqual } from 'react-redux'
import { getImageSize } from '@/utils/format'

interface IProps {
  children?: ReactNode
}
const SettleSinger: FC<IProps> = () => {
  // 获取redux中的数据
  const { settleSingers } = useAppSelector(
    (state) => ({
      settleSingers: state.recommend.settleSingers
    }),
    shallowEqual
  )
  return (
    <SettleSingerWrapper>
      <AreaHeaderV2
        title="入驻歌手"
        moreText="查看全部 &gt;"
        moreLink="#/discover/artist"
      />
      <div className="artists">
        {settleSingers.map((item) => {
          return (
            <a href="#/discover/artist" className="item" key={item.id}>
              <img src={getImageSize(item.picUrl, 62)} alt="" />
              <div className="info">
                <div className="name">{item.name}</div>
                <div className="alia">{item.alias.join(' ')}</div>
              </div>
            </a>
          )
        })}
      </div>
      <div className="apply-for">
        <a href="">申请成为网易音乐人</a>
      </div>
    </SettleSingerWrapper>
  )
}
export default memo(SettleSinger)
