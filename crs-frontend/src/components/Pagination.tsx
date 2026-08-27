interface Props{

    currentPage:number;

    totalPages:number;

    onPageChange:(page:number)=>void;

}



export default function Pagination(
    {
        currentPage,
        totalPages,
        onPageChange

    }:Props){



    if(totalPages<=1)
        return null;



    return (

        <div>


            <button

                disabled={currentPage===0}

                onClick={()=>onPageChange(currentPage-1)}

            >

                Trang trước

            </button>



            {

                Array.from(
                    {
                        length:totalPages
                    },
                    (_,i)=>(


                        <button

                            key={i}

                            onClick={()=>onPageChange(i)}

                            style={{

                                fontWeight:
                                    i===currentPage?
                                        "bold":
                                        "normal"

                            }}

                        >

                            {i+1}

                        </button>


                    )

                )


            }



            <button

                disabled={
                    currentPage>=totalPages-1
                }

                onClick={
                    ()=>onPageChange(currentPage+1)
                }

            >

                Trang sau

            </button>



        </div>

    )

}