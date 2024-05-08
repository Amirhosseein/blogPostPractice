import { useReducer, useState } from "react";
import Input from "../shared/Input/Input";
import { MouseEvent } from "react";
import classes from "./BlogPost.module.css";
import useHttpHooks from "@/Hooks/useHttpHook";
import { useRouter } from "next/router";
import Modal from "../shared/Modal/Modal";
import AlertMessage from "../shared/AlertMessage/AlertMessage";
import LoadingComp from "../shared/LoadingComp/LoadingComp";
import Message from "../shared/Message/Message";


type inputsTypes = { value: string; isValid: boolean; isBlurred: boolean };

type allInputsTypes = {
  title: inputsTypes;
  text: inputsTypes;
};

interface pagestate {
  isValid: boolean;
  inputs: allInputsTypes;
}

type actionType = {
  type: "write" | "blur";
  value: string;
  name: "text" | "title";
};

const inputValidity = (str: string, limit: number = 3): boolean => {
  if (str.length < limit) {
    return false;
  } else if (str.includes("*") || str.includes("|") || str.includes("?")) {
    return false;
  } else {
    return true;
  }
};

const othersValidtyCheck = (
  name: "text" | "title",
  inputs: allInputsTypes
): boolean => {
  const keys = Object.keys(inputs);
  let valid = true;
  keys.forEach((key) => {
    if (key === name) return;

    valid = valid && inputs[key as keyof allInputsTypes].isValid;
  });
  return valid;
};

const reducer = (state: pagestate, action: actionType): pagestate => {
  switch (action.type) {
    case "write":
      const validity = inputValidity(action.value);
      const othersValidty = othersValidtyCheck(action.name, state.inputs);
      return {
        isValid: othersValidty && validity,
        inputs: {
          ...state.inputs,
          [action.name]: {
            ...state.inputs[action.name],
            value: action.value,
            isValid: validity,
          },
        },
      };
    case "blur":
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.name]: { ...state.inputs[action.name], isBlurred: true },
        },
      };
    default:
      return {
        isValid: false,
        inputs: {
          title: { value: "", isValid: false, isBlurred: false },
          text: { value: "", isValid: false, isBlurred: false },
        },
      };
  }
};


// BlogPost COMP

const BlogPost = ({ edit = false,titleInit="",textInit="",id="" }) => {
  const [state, dispatcher] = useReducer(reducer, {
    isValid: edit,
    inputs: {
      title: { value: titleInit, isValid: edit, isBlurred: false },
      text: { value: textInit, isValid: edit, isBlurred: false },
    },
  });

  
  const [errorText,setErrorText] = useState<null|string>(null)

  const { isLoading, error, sendRequest, erorrHandeler } = useHttpHooks();

  const { push } = useRouter();


  const deleteFromDataBase = async (e: MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault();
    const conf = await sendRequest(`/api/posts/${id}`,"DELETE");
    console.log(conf);
    if(!conf?.error){
      push("/");
    } else{
      setErrorText(conf?.error)
    } 

    
  };

  const btnHandeler = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(state);
    const name = (e.target as HTMLButtonElement).name;
 
    if (!state.isValid) return;
    
    if(name === "delete"){
      const conf = await sendRequest(`/api/posts/${id}`,"DELETE");
     
      if(!conf?.error)  return push("/");
      setErrorText(conf?.error);
    }

    if(name === "save"){
        try{
          const conf = await sendRequest("/api/posts","POST",JSON.stringify({title:state.inputs.title.value,text:state.inputs.text.value}));
          console.log(conf);
          if(!conf?.error) return  push("/");
          setErrorText(conf?.error);
        }catch(e){
          console.error(e);
          setErrorText("request failed!");
        }
    }else if(name === "edit"){
      try{
        const conf = await sendRequest(`/api/posts/${id}`,"PUT",JSON.stringify({title:state.inputs.title.value,text:state.inputs.text.value}));
       console.log(conf);
       if(!conf?.error) return push("/");
       setErrorText(conf?.error);
      }catch(e){
        console.error(e);
        setErrorText("request failed!");
      }
      
    }


  };

  return (
    <>
    <div className={classes.mainContainer}>
      <form className={classes.blogForm}>
        <div>
          <label> Title: </label>
          <input
            name="title"
            type="text"
            value={state.inputs.title.value}
            onChange={(e) =>
              dispatcher({
                type: "write",
                value: e.target.value,
                name: "title",
              })
            }
            onBlur={(e) =>
              dispatcher({ type: "blur", name: "title", value: "" })
            }
          />

          {!state.inputs.title.isValid && state.inputs.title.isBlurred && (
            <p className={classes.errorText}> Enter 3 Characters at Least (do not use * ? | ) </p>
          )}
        </div>

        <div>
          <label> Description: </label>
          <textarea
            name="text"
            value={state.inputs.text.value}
            onChange={(e) =>
              dispatcher({ type: "write", value: e.target.value, name: "text" })
            }
            onBlur={(e) =>
              dispatcher({ type: "blur", name: "text", value: "" })
            }
          />

          {!state.inputs.text.isValid && state.inputs.text.isBlurred && (
            <p className={classes.errorText}> Enter 3 Characters at Least (do not use * ? | ) </p>
          )}
        </div>

        {edit ? (
          <div className={classes.btnContainer}>
            <button className={classes.blogBtn} name="edit" disabled={!state.isValid}  onClick={(e: MouseEvent<HTMLButtonElement>) => btnHandeler(e)}>
              {" "}
              EDIT{" "}
            </button>
            <Modal>
          <Modal.Open openWindow="delete">
            <button name="delete" className={classes.blogBtn}>DELETE</button>
          </Modal.Open>

          <Modal.Window name="delete">
              <AlertMessage id={id} onCloseModal={()=>{}} deletTaskHandeler={(e:MouseEvent<HTMLButtonElement>)=>{deleteFromDataBase(e)}} />
          </Modal.Window>
      </Modal>
          </div>
        ) : (
          <button
            className={classes.blogBtn}
            name="save"
            onClick={(e: MouseEvent<HTMLButtonElement>) => btnHandeler(e)}
            disabled={!state.isValid}
          >
            SAVE
          </button>
        )}
      </form>
    </div>


    {isLoading && <LoadingComp /> }

    {error && <Message type="error" message={error} messageHandeler={erorrHandeler} />}

    {errorText && <Message type="error" message={errorText} messageHandeler={()=> setErrorText(null) } />}
    </>
  );
};

export default BlogPost;
