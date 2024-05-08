import {useState,useCallback,useEffect,useRef, MutableRefObject} from "react";

type bodyType = FormData | null | string;

const useHttpHooks = ()=>{
    const [isLoading,setIsLoading] = useState(false);
    const [error,setError] = useState<any>(false);

    const activeRequest: MutableRefObject<AbortController[]> = useRef([]);

    const sendRequest = useCallback(async(url:string,method='GET',body?:bodyType,headers={})=>{

        setIsLoading(true);
        const httpAbortContorller  = new AbortController();
        activeRequest.current.push(httpAbortContorller);
        body = body? body : null;
       
        try {
         
           const response = await fetch(url,{
                method,
                body,
                headers,
                signal : httpAbortContorller.signal
            });
            
            activeRequest.current = activeRequest.current.filter(req => req !== httpAbortContorller)

            if(!response.ok){
                const text = await response.text();
                throw new Error(JSON.parse(text).message + " !!!");
            }
            const responseData = await response.json();
            setIsLoading(false);
            return responseData;

        } catch (error) {
            setIsLoading(false);
            if(error instanceof Error) setError(error.message);
            throw error ;
        }

       

    },[])

    const erorrHandeler = ()=>{
        setError(null);
    }

    useEffect(()=>{
        return ()=>{
            // eslint-disable-next-line react-hooks/exhaustive-deps
            activeRequest.current.forEach(abortCtrl => {
                abortCtrl.abort();
            });
        }
    },[])

    return {isLoading,error,sendRequest,erorrHandeler}
};

export default useHttpHooks ;