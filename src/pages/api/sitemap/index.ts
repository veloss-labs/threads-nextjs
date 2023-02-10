// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

type Data = {
  posts: Post[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const request = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await request.json();

  res.status(200).json({ posts });
}
