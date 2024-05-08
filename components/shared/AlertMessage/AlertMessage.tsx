import { MouseEvent } from "react";
import classes from "./AlertMessage.module.css";

const AlertMessage = ({id,onCloseModal,deletTaskHandeler}:{id:string,onCloseModal:()=>void,deletTaskHandeler:(e:MouseEvent<HTMLButtonElement>)=>void}) => {

 
  
  return (
  <div>
    <p>ARE YOU SURE FOR DELETING THIS POST ??</p>
    <div className={classes.btnContainer}>
      <button className={classes.btn + " " +classes.yesBtn} name="yes" onClick={(e)=>{deletTaskHandeler?.(e)}}> YES </button>
      <button className={classes.btn + " " +classes.noBtn} name="no" onClick={()=>{onCloseModal?.()}}> NO </button>
    </div>
   
  </div>
  );
};

export default AlertMessage;
