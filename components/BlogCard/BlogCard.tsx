import { useState } from "react";
import classes from "./BlogCard.module.css";
import Link from "next/link";
import { ObjectId } from "mongodb";

type props = {
    id:string|ObjectId,
    title:string,
    text:string
}

const BlogCard = ({id,title,text}:props)=>{

    // const [showText,showTextSetter] = useState(false);
    const textThreshold = 50;

    // const showTextHandeler = ()=>{
    //     showTextSetter(pre => !pre);
    // };

    return(
        <div 
        className={classes.blogCard}
        // style={showText?{height:"auto"}:{}}
        >
            <div title="post header">
                <h3>{title}</h3>
            </div>
            <div title="post context">
                <p>{(text.length > textThreshold) ? `${text.slice(0,textThreshold)} ...` : text}</p>
                {/* {text.length > textThreshold && <button onClick={showTextHandeler}>{showText?'Show Less':'Show More'}</button>} */}
                <button className={classes["blogCard--btn"]}>
                <Link href={`/posts/${id}`}> Navigate To Post </Link>
            </button>
            </div>
            
        </div>
    )
};


export default BlogCard;