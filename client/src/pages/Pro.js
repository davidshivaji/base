import React, { useState, useEffect } from 'react'

const Pro = () => {

    const [data, setdata] = useState()
    const [realdata, setrealdata] = useState()

    function handleChange(e) {
      setdata(e.target.value)
    }

    function handleSubmit(e) {
      e.preventDefault()
      setrealdata(data)

    }

    useEffect(() => {
      console.log(0)
    }, [])

    return (
        <div className="homecard">
          <span>
          Wow, what a privilege.
          </span>

        </div>
    )
}

export default Pro
