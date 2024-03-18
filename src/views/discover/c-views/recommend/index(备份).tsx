import hyRequest from '@/service'
import React, { memo, useEffect, useState } from 'react'
import type { FC, ReactNode } from 'react'

interface Iprops {
  children?: ReactNode
}

interface IBanner {
  imageUrl: string
  targetId: number
  targetType: number
  titleColor: string
  typeTitle: string
  url: string
  exclusive: boolean
  scm: string
  bannerBizType: string
}

const Recommend: FC<Iprops> = () => {
  const [banners, setBanners] = useState<IBanner[]>([])
  // 测试网络请求
  useEffect(() => {
    hyRequest.get({ url: '/banner' }).then((res) => {
      console.log(res)
      // setBanners(res.banners)
    })
  }, [])
  return (
    <div>recommend</div>
    // <div>
    //   {banners.map((item, index) => {
    //     return <div key={index}>{item.imageUrl}</div>
    //   })}
    // </div>
  )
}

export default memo(Recommend)
