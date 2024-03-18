import { useAppSelector } from '@/store'
import React, { memo, useRef, useState } from 'react'
import { Carousel } from 'antd'

import type { FC, ReactNode, ElementRef } from 'react'
import { shallowEqual } from 'react-redux'
import { BannerControl, BannerLeft, BannerRight, BannerWrapper } from './style'
import classNames from 'classnames'

interface IProps {
  children?: ReactNode
}
const TopBanner: FC<IProps> = () => {
  // 定义内部数据
  const [currentIndex, setCurrentIndex] = useState(0)
  const bannerRef = useRef<ElementRef<typeof Carousel>>(null)
  // 从store中获取数据
  const { banners } = useAppSelector(
    (state) => ({
      banners: state.recommend.banners
    }),
    shallowEqual
  )
  // 定义左右按钮事件
  function handlePrevClick() {
    bannerRef.current?.prev()
  }
  function handleNextClick() {
    bannerRef.current?.next()
  }
  // 轮播图切换回调函数
  function handleAfterChange(current: number) {
    setCurrentIndex(current)
  }
  // 获取背景图片
  let imageUrl = banners[currentIndex]?.imageUrl
  if (imageUrl) {
    imageUrl = imageUrl + '?imageView&blur=40x20'
  }

  return (
    <BannerWrapper
      style={{ background: `url('${imageUrl}') center center / 6000px` }}
    >
      <div className="banner wrap-v2">
        <BannerLeft>
          <Carousel
            autoplay
            effect="fade"
            dots={false}
            ref={bannerRef}
            afterChange={handleAfterChange}
          >
            {banners.map((item) => {
              return (
                <div className="banner-item" key={item.imageUrl}>
                  <img
                    className="image"
                    src={item.imageUrl}
                    alt={item.typeTitle}
                  />
                </div>
              )
            })}
          </Carousel>
          <ul className="dots">
            {banners.map((item, index) => {
              return (
                <li key={item.imageUrl}>
                  <span
                    className={classNames('item', {
                      active: index === currentIndex
                    })}
                  ></span>
                </li>
              )
            })}
          </ul>
        </BannerLeft>
        <BannerRight></BannerRight>
        <BannerControl>
          <button className="btn left" onClick={handlePrevClick}></button>
          <button className="btn right" onClick={handleNextClick}></button>
        </BannerControl>
      </div>
    </BannerWrapper>
  )
}
export default memo(TopBanner)
