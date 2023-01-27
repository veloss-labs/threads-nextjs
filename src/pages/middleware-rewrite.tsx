import Layout from "~/components/Layout";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';


export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      isRewritten: context.query.rewritten === "true"
        ? "✅"
        : "❌",
    },
  };
}

export default function Page({ isRewritten }:  InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <article>
        <h1>
          Middleware - rewrite
        </h1>
        <hr />
        <p>
          <b>Test 1:</b>URL is rewritten { isRewritten }
        </p>
      </article>
    </Layout>
  );
}