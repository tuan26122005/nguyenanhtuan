import { useState, useEffect, useCallback } from "react";
import { getCourses } from "./courseApi";
import type { Course } from "../types/course";
import axios from "axios";


export type LoadState =
    | "loading"
    | "success"
    | "empty"
    | "error";


export function useCourses(
    keyword:string,
    page:number,
    size:number = 5
){

    const [courses,setCourses] = useState<Course[]>([]);

    const [totalPages,setTotalPages]
        = useState(0);


    const [state,setState]
        = useState<LoadState>("loading");


    const [errorMessage,setErrorMessage]
        = useState("");


    const fetchCourses = useCallback(()=>{

        setState("loading");


        getCourses(keyword,page,size)

            .then(res=>{

                const data=res.data;


                setCourses(data.content);

                setTotalPages(data.totalPages);


                if(data.content.length===0)
                {
                    setState("empty");
                }
                else
                {
                    setState("success");
                }

            })


            .catch(err=>{

                let message=
                    "Có lỗi xảy ra";


                if(axios.isAxiosError(err))
                {

                    if(err.response?.data?.message)
                    {
                        message=
                            err.response.data.message;
                    }

                    else if(!err.response)
                    {
                        message=
                            "Không kết nối được hệ thống";
                    }

                }


                setErrorMessage(message);

                setState("error");

            })


    },[keyword,page,size]);



    useEffect(()=>{

        fetchCourses();

    },[fetchCourses]);



    return {

        courses,
        totalPages,
        state,
        errorMessage,
        refetch:fetchCourses

    }

}