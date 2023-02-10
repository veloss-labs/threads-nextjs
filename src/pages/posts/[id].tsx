import React from 'react';
import Layout from '~/components/Layout';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';

import { getDetailSitemapApi } from '~/api/services/app/mock';
import { useSitemapDetailQuery } from '~/api/services/hook/mock';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  try {
    const id = ctx.query.id?.toString();
    if (!id) {
      return {
        notFound: true,
      };
    }

    const post = await getDetailSitemapApi(id, {
      ctx,
    });

    return {
      props: {
        id,
        post,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default function Page({
  id,
  post,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useSitemapDetailQuery(id, {
    initialData: post,
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });

  return (
    <Layout>
      <article>
        <h1>Sitemap Detail</h1>
        <hr />
        <p>
          <b>User ID:</b>
          {data?.userId}
        </p>
        <p>
          <b>Post ID:</b>
          {data?.id}
        </p>
        <p>
          <b>Post Title:</b>
          {data?.title}
        </p>
        <p>
          <b>Post Body:</b>
          {data?.body}
        </p>
      </article>
    </Layout>
  );
}
