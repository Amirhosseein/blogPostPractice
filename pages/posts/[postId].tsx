import { useRouter } from 'next/router'
import BlogPost from '@/components/BlogPost/BlogPost';
import { GetStaticProps } from 'next';
import clientPromise from '@/dataBase/mongodb';
import { ObjectId } from 'mongodb';



type propsType = {post:{ _id: string| ObjectId; title: string; text: string }};

const Posts = ({post:{_id,title,text}}:propsType)=>{
   

    return (
        <div>
           { (title && text) ? <BlogPost id={_id.toString()}  titleInit={title} textInit={text} edit /> : <p style={{textAlign:"center"}}> waiting... </p>}
        </div>
    );
};


export async function getStaticProps(context:any){
    console.log(context?.params?.postId);
    const id = context?.params?.postId;
    const client = await clientPromise;
    const db = client.db("blogpost");
    const postCollection = db.collection("posts");

    const post = await postCollection.find({_id:new ObjectId(id)}).toArray();
    

    return {
        props:{post: JSON.parse(JSON.stringify(post[0])) }
    };
}


export async function getStaticPaths(){

    const client = await clientPromise;
    const db = client.db("blogpost");
    const postCollection = db.collection("posts");

    const posts = await postCollection.find({}).toArray();


    const resualt = posts.map(post =>{
        return {params:{
            postId:post._id.toString()
        }}
    } );

    return { paths: resualt, fallback: true };
}




export default Posts;

