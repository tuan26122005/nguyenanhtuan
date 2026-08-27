import { useState, useEffect } from "react";


interface SearchBoxProps {

    onSearch:(keyword:string)=>void;

    placeholder?: string;

}



export default function SearchBox({

                                      onSearch,

                                      placeholder

                                  }:SearchBoxProps){


    const [inputValue,setInputValue]
        = useState("");



    useEffect(()=>{


        const timer=setTimeout(()=>{

            onSearch(inputValue.trim());

        },400);



        return ()=>clearTimeout(timer);


    },[inputValue,onSearch]);




    return (

        <input

            type="text"

            value={inputValue}


            onChange={
                e=>setInputValue(e.target.value)
            }


            placeholder={
                placeholder ?? "Tìm kiếm môn học..."
            }


            style={{

                width:400,

                padding:10

            }}

        />

    );

}