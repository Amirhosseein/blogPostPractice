import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "@/dataBase/mongodb";
import { ObjectId } from "mongodb";

type errorType = {
  error: string | null;
  confirmed: string | null;
};

type dataType = {
  post: { _id: string | ObjectId; title: string; text: string };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<errorType | dataType>
) {
  const client = await clientPromise;
  const db = client.db("blogpost");
  const postCollection = db.collection("posts");
  const id = req.query.id;
  if (!id)
    return res.status(404).json({ error: "data not found", confirmed: null });

  if (req.method?.toLocaleLowerCase() === "get") {
    const post: any = await postCollection
      .find({ _id: new ObjectId(id.toString()) })
      .toArray();
    if (!post)
      return res.status(404).json({ error: "data not found", confirmed: null });

    return res.status(200).json({ post: post[0] });
  } else if (req.method?.toLocaleLowerCase() === "put") {
    const { title, text } = JSON.parse(req.body);
    if (!title || !text)
      return res
        .status(403)
        .json({ error: "inputs are not valid", confirmed: null });
    const post = await postCollection.updateOne(
      { _id: new ObjectId(id.toString()) },
      { $set: { title, text } }
    );
    if (post.acknowledged) {
      return res.status(200).json({error:null,confirmed:"data has been updated"});
    } else {
        return res.status(500).json({error:"data has NOT been updated",confirmed:null});
    }
  } else if(req.method?.toLocaleLowerCase() === "delete"){
    const post = await postCollection.deleteOne({ _id: new ObjectId(id.toString()) });
    
    if (post.acknowledged) {
        return res.status(200).json({error:null,confirmed:"data has been deleted"});
      } else {
          return res.status(500).json({error:"data has NOT been deleted",confirmed:null});
      }
  }
}
