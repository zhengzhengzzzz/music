import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'

interface Iprops {
  children?: ReactNode
}

const Template: FC<Iprops> = () => {
  return <div>Template</div>
}

export default memo(Template)

// import React,{memo} from 'react'
// import type {ReactNode} from 'react'

// interface IPerson{
//     name:string
//     age:number
//     height?:number
//     children?:ReactNode
// }

// const Download:React.FunctionComponent<IPerson>= (props)=>{
//     return (
//         <div>
//             {props.age}
//             {props.name}
//             {props.height}
//             {props.children}
//         </div>
//     )
// }

// Download.defaultProps = {
//     height:1.88
// }

// 直接对props进行约束
// const Download = (props:IPerson)=>{
//     return (
//         <div>
//             {props.age}
//             {props.name}
//             {props.height}
//         </div>
//     )
// }

// export default memo(Download)
