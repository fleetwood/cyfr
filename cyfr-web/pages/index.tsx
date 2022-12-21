import { Post } from ".prisma/client";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useEffect, useState } from "react";
import PageStatus from "../components/containers/PageStatus";
import { useCyfrUser } from "../hooks/useCyfrUser";
import MainLayout from "../components/layouts/MainLayout";
import { useSession } from "../lib/next-auth-react-query";
import { Posts } from "../prisma/posts";
import { ResponseResult, ResponseError } from "../types/Response";
import { __prod__ } from "../utils/constants";
import { jsonify } from "../utils/log";
import MainPagePostListItem from "../components/containers/Post/MainPagePostListItem";

type HomePageProps = ResponseResult<Post[]>;

const Home = (props: HomePageProps) => {
  const [posts, setPosts] = useState<Post[]>();
  const [error, setError] = useState<ResponseError>();
  const [session] = useSession({required:false});
  const [cyfrUser,setCyfrUser]=useCyfrUser(null)

  useEffect(() => {
    if (props.result) {
      setPosts(props.result);
    }
    if (props.error) {
      setError(props.error);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <MainLayout
        className="scroll-smooth"
        sectionTitle="Cyfr"
        subTitle="The Writer's Site"
      >
        {cyfrUser && <>
          <h1>Cyfr User {cyfrUser.name || 'Cyfr User has no name'}</h1>
        </>}
        <PageStatus watch={posts} error={error} />
        {posts && posts.map((post) => <MainPagePostListItem key={post.id} {...post} />)}
        {session && <pre>{jsonify(session)}</pre>}
      </MainLayout>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const posts = await Posts.all({ take: 25 });
  return {
    props: {
      ...posts,
    },
  };
}

export default Home;
