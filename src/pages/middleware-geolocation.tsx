import Layout from "~/components/Layout";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';


export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      qs: JSON.stringify(context.query),
    },
  };
}

export default function Page({ qs }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <article>
        <h1>
          Middleware - geolocation
        </h1>
        <hr />
        <p>
          <b>Test 1:</b>
          URL query contains country, city, and region: {qs}
        </p>
      </article>
    </Layout>
  );
}