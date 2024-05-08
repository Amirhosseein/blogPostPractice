
import type { NextApiRequest, NextApiResponse } from "next";

import  clientPromise from "@/dataBase/mongodb";
import { ObjectId } from "mongodb";

type errorType = {
  error: string | null;
  confirmed: string | null;
};

type dataType = {
  posts: { _id: string| ObjectId; title: string; text: string }[];
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<errorType | dataType>
) {

  const client = await clientPromise;
  const db = client.db("blogpost");
  const postCollection = db.collection("posts");


  if (req.method?.toLocaleLowerCase() === "get") {
    // res.status(200).json({posts:DUMMY_DATA});
    
    const allPosts :any = await postCollection.find({}).toArray();
    console.log(allPosts);
    return res.status(200).json({posts:allPosts});


  } else if (req.method?.toLocaleLowerCase() === "post") {
    console.log("save data");
    const {title,text} = JSON.parse(req.body);
    if(!title || !text) return res.status(403).json({error:"inputs are not valid",confirmed:null})
    // save to dataBase

    const newPost = await postCollection.insertOne({title,text});
    
    if(newPost?.acknowledged){
      return res.status(200).json({error:null,confirmed:"data saved"});
    }

  } else {
    res
      .status(403)
      .json({ error: "only get or post are allowed", confirmed: null });
  }
}
