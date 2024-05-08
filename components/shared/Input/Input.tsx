import { HTMLInputTypeAttribute } from "react";

type propsType ={
    type?:HTMLInputTypeAttribute,
    placeholder?:string,

}

const Input = ({type="text",placeholder=""}:propsType)=>{


    return <input type={type}  placeholder={placeholder}/>
};

export default Input;