import React from 'react'
import toast from 'react-hot-toast'

function HomePage() {
  return (
    <div>
        <button className='btn btn-secondary' onClick={()=>toast.success("This is success toast")}>Click Me</button>
    </div>
  )
}

export default HomePage
