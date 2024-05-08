import classes from "./Header.module.css";
import Link from "next/link";

const Header = ()=>{
    return <>
        <nav className={classes.headerNav}>

            <Link href={'/'}>HOME</Link>
            <Link href={'/posts/newpost'}>NEW POST</Link>
            
        </nav>
    </>
};

export default Header;