import React, { useEffect, useState } from "react";
import { PrismaPost } from "../prisma/entities";
import { PostDetail } from "../prisma/types";
import { timeDifference, ymd } from "../utils/helpers";
import StaticLayout from './../components/layouts/StaticLayout'
import { InferGetServerSidePropsType } from "next";
import { now } from "next-auth/client/_utils";

export async function getServerSideProps(context: any) {
  const post = await PrismaPost.byId('clenla3qm001yjpn6uplujp87')
  return {
    props: {
      post
    },
  };
}

type TestProps = {
  post: PostDetail
}

const Test = ({post}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const time = ymd()

  return (
    <StaticLayout sectionTitle="Time" >
      <p>{time}</p>
      <p>{ymd(post?.createdAt)}</p>
      <p>{timeDifference(post ? post.createdAt : new Date())}</p>
    </StaticLayout>
  );
};

export default Test;