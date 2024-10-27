/** @jsxImportSource @emotion/react */
import { forwardRef } from "react"

const Avatar = forwardRef(({name, ...rest}, ref) => {
return(
    <div ref={ref} {...rest} className="bg-third d-flex flex-center font-xl" css={{width: '40px',height: '40px', borderRadius: '50%', fontWeight:'bold', cursor: 'pointer'}}>
      {name ? name.split('')[0].toUpperCase() : 'XXX'}
    </div>
  )
})

export default Avatar