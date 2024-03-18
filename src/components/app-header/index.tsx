import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { HeaderLeft, HeaderRight, HeaderWrapper } from './style'
import headerTitles from '@/assets/data/header_titles.json'
import { NavLink } from 'react-router-dom'
import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'

interface IProps {
  children?: ReactNode
}

const AppHeader: FC<IProps> = () => {
  function showItem(item: any) {
    if (item.type === 'path') {
      return (
        <NavLink to={item.link}>
          {item.title}
          <i className="icon sprite_01"></i>
        </NavLink>
      )
    } else {
      return (
        <a rel="noreferrer" target="_blank" href={item.link}>
          {item.title}
        </a>
      )
    }
  }

  return (
    <HeaderWrapper>
      <div className="content wrap-v1">
        <HeaderLeft>
          <a className="logo sprite_01" href="/">
            网易云音乐
          </a>
          <div className="select-list">
            {headerTitles.map((item) => {
              return (
                <div className="active select-item" key={item.title}>
                  {showItem(item)}
                </div>
              )
            })}
          </div>
        </HeaderLeft>
        <HeaderRight>
          <Input
            className="search"
            prefix={<SearchOutlined />}
            placeholder="音乐/视频/电台/用户"
          />
          <div className="center">创作者中心</div>
          <div className="login">登录</div>
        </HeaderRight>
      </div>
      <div className="divider"></div>
    </HeaderWrapper>
  )
}
export default memo(AppHeader)
