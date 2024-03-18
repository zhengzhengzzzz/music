import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { HotAnchorWrapper } from './style'
import AreaHeaderV2 from '@/components/area-header-v2'
import { hotRadios } from '@/assets/data/local_data'
interface IProps {
  children?: ReactNode
}
const HotAnchor: FC<IProps> = () => {
  return (
    <HotAnchorWrapper>
      <AreaHeaderV2 title="热门主播" />
      <div className="anchor">
        {hotRadios.map((item) => {
          return (
            <div className="item" key={item.name}>
              <a href="" className="image">
                <img src={item.picUrl} alt="" />
              </a>
              <div className="info">
                <a className="name">{item.name}</a>
                <div className="position">{item.position}</div>
              </div>
            </div>
          )
        })}
      </div>
    </HotAnchorWrapper>
  )
}
export default memo(HotAnchor)
