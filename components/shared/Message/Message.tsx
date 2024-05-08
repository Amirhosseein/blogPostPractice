import { useEffect, useState } from "react";
import classes from "./Message.module.css";


interface propsType {
  type?:"confirm" | "error";
  message:string
  messageHandeler?:()=>void;
}

const Message = ({type="confirm",message,messageHandeler}:propsType) => {
  const [show,setShow] = useState(true);


  useEffect(()=>{
  

    const job = ()=>{
      setShow(false);
      messageHandeler?.();
    }

    let timer = setTimeout(job,1000*5) 

    return ()=> clearTimeout(timer)
  },[])

  if(!show) return null;
  return (
    <div className={classes["message--container"]} style={type === "confirm" ? {backgroundColor:"#90D26D"} : {backgroundColor:"#D20062"}}>
      <h3>
        {message}
      </h3>
    </div>
  );
};

export default Message;
