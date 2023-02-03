// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { createCSRFToken } from '~/libs/server/csrf';

type Data = {
  csrfToken: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const csrfToken = createCSRFToken();
  res.status(200).json({ csrfToken });
}
