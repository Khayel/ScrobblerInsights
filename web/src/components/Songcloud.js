import React, { useEffect, useRef } from 'react';
const {tableau} = window;
function Songcloud({user_id}) {
    const vizRef = useRef(null)
    const url = "https://public.tableau.com/views/test_16402021326920/Dashboard3?:language=en-US&publish=yes&:display_count=n&:origin=viz_share_link"
    const options = {
        device:"desktop",
        height: "100vH",
        width: "47W",
        "User Id": user_id
    }
    // function filterUser(){
    //     vizRef.current().Viz().getWorkbook().changeParameterValueAsync('user_id', user_id).then(
    //         function (){ console.log('Parameter set');}
    //         );
    // }
    function initViz() {    
        new tableau.Viz(vizRef.current, url, options)
    }

    useEffect ( () => {
        initViz()
    }, [])

    return(
        <div className='vizContainer' ref={vizRef}></div>
    )
}
export default Songcloud