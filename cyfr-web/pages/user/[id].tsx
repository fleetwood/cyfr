import React, { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import JsonBlock from "../../components/ui/jsonBlock";
import { UserDetail, Users } from "../../prisma/users";

export async function getServerSideProps(context: any) {
  const userId = context.params.id;
  const user = await Users.byId(userId);

  return {
    props: {
      user,
    },
  };
}

type UserDetailProps = {
  user: UserDetail;
};

const UserDetail = ({user}: UserDetailProps) => {
  return (
    <MainLayout
      pageTitle="User Detail"
      sectionTitle=""
      subTitle={user?.name || ""}
    > {user && 
        <JsonBlock data={user} theme='adventure' />
        }
    </MainLayout>
  );
};

export default UserDetail;
