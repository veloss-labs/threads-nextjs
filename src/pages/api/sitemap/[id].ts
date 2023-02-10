// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Data = {
  post: Post | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const id = req.query.id?.toString();
    const request = await fetch(
      'https://jsonplaceholder.typicode.com/posts/' + id,
    );
    const post = await request.json();
    res.status(200).json({ post });
  } catch (error) {
    res.status(404).json({ post: null });
  }
}
