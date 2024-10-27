
export const postRequest = async (url,body) => {

    body = JSON.stringify(body);
    const res = await fetch(`http://localhost:5000${url}`,{
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type" : "application/json"
        },
        body
    });

    const data = await res.json();

    if(!res.ok){
        let message;

        //if message inside data 
        if(data?.message){
            message = data.message;
        }
        else{
            message = data;
        }
        return { error : true,message};
    }
    return data;
}


export const getRequest = async (url) => {
    const response = await fetch(`http://localhost:5000${url}`, {
        credentials: 'include' // ensure cookies are sent with the request
    });

    const data = await response.json();

    //if error
    if(!response.ok){
        let message = data;
        //if message inside data 
        if(data?.message){
            message = data.message;
        }
    
        return {error: true,message};

    }
    return data ;

}

export const patchRequest = async (url,body) => {

    body = JSON.stringify(body);
    console.log(url,body);
    const res = await fetch(`http://localhost:5000${url}`,{
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type" : "application/json"
        },
        body
    });

    const data = await res.json();

    if(!res.ok){
        let message;

        //if message inside data 
        if(data?.message){
            message = data.message;
        }
        else{
            message = data;
        }
        return { error : true,message};
    }
    return data;
}