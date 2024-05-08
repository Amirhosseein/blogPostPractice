import classes from "@/styles/Home.module.css";
import BlogCard from "@/components/BlogCard/BlogCard";
import  clientPromise from "@/dataBase/mongodb";
import { ObjectId } from "mongodb";
import { json } from "stream/consumers";


type dataType = {
  posts: { _id: string| ObjectId; title: string; text: string }[];
};

const Home = (props:dataType) => {

  if(props.posts.length === 0) return <p style={{textAlign:"center"}}> Loading ...</p>
  return (
    <div className={classes.home}>
      <h3 className={classes["home--header"]}>showing blog posts</h3>
      <div className={classes['home--main']}>
        {props.posts.map(post=>{
          return <BlogCard key={post["_id"].toString()} id={post["_id"].toString()} title={post.title} text={post.text}  />
        })}
        
      </div>
    </div>
  );
};



export  async function getStaticProps(){
  

  const client = await clientPromise;
  const db = client.db("blogpost");
  const postCollection = db.collection("posts");

  const allPosts :any = await postCollection.find({}).toArray();
  

  return {
    props:{posts:JSON.parse(JSON.stringify(allPosts))},
    revalidate:60*5

  };

}




export default Home;