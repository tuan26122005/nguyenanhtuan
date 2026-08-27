import type {Course}
    from "../types/course";

import type {LoadState}
    from "../api/useCourses";



interface Props{

    courses:Course[];

    state:LoadState;

    errorMessage:string;

    onRetry:()=>void;

}



export default function CourseList(
    {
        courses,
        state,
        errorMessage,
        onRetry

    }:Props){



    if(state==="loading")
        return <p>Đang tải...</p>



    if(state==="error")

        return (

            <div>

                <p>{errorMessage}</p>

                <button onClick={onRetry}>

                    Thử lại

                </button>

            </div>

        )



    if(state==="empty")

        return <p>
            Không tìm thấy môn học
        </p>



    return (

        <table>

            <thead>

            <tr>

                <th>
                    Tên môn
                </th>

                <th>
                    Số tín chỉ
                </th>

                <th>
                    Số chỗ
                </th>


            </tr>

            </thead>


            <tbody>


            {

                courses.map(course=>(


                    <tr key={course.id}>


                        <td>
                            {course.tenMonHoc}
                        </td>


                        <td>
                            {course.soTinChi}
                        </td>


                        <td>

                            {course.soChoConLai}

                            /

                            {course.soChoToiDa}

                        </td>


                    </tr>


                ))

            }


            </tbody>


        </table>


    )


}