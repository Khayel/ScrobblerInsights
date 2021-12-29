import React, { useEffect, useRef } from 'react';
const {tableau} = window;
function Songcloud() {
    const ref = useRef(null)
    const url = "https://public.tableau.com/views/test_16402021326920/Dashboard1?:language=en-US&:display_count=n&:origin=viz_share_link"
    const options = {
        device:"desktop"
    }
    function initViz() {
        
        new tableau.Viz(ref.current, url, options)
    }

    useEffect ( () => {
        initViz()
    }, [])

    return(
        <div className='vizContainer' ref={ref}></div>
    )
}
export default Songcloud