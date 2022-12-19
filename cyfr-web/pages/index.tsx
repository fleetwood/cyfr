import { Post } from ".prisma/client";
import type { NextPage } from "next";

import { useEffect, useState } from "react";
import PageStatus from "../components/containers/PageStatus";
import MainLayout from "../components/layouts/MainLayout";
import { Posts } from "../prisma/posts";
import { ResponseResult, ResponseError } from "../types/Response";
import { __prod__ } from "../utils/constants";
import { log } from "../utils/log";

const Home: NextPage = (props: ResponseResult<Post[]>) => {
  const [posts, setPosts] = useState<Post[]>();
  const [error, setError] = useState<ResponseError>();

  useEffect(() => {
    if (props.result) {
      setPosts(props.result);
    } else if (props.error) {
      setError(props.error);
    } else {
      log("Weird response from props?", props);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <MainLayout
        className="scroll-smooth"
        sectionTitle="Cyfr"
        subTitle="The Writer's Site"
      >
        <PageStatus watch={posts} error={error} />
        {posts && posts.map((post) => <div>{post.content}</div>)}
      </MainLayout>
    </div>
  );
};

export async function getServerSideProps() {
  const posts = await Posts.all({ take: 25 });
  return {
    props: posts,
  };
}

export default Home;
