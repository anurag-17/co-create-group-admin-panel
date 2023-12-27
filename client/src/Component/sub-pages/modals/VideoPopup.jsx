import React, { useEffect, useRef } from 'react'

const VideoPopup = ({data}) => {
console.log(data)
  return (
  <div className="overflow-y-scroll">
      <video controls className="max-h-[500px]" >
      <source src={data} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>

  )
}

export default VideoPopup