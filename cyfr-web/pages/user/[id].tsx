import React, { useState } from "react";
import MainLayout from "../../components/layouts/MainLayout";
import { UserDetail, Users } from "../../prisma/users";
import { prismaStringify } from "../../utils/log";

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

const UserDetail = (props: UserDetailProps) => {
  const [user, setUser] = useState(props.user);
  return (
    <MainLayout
      pageTitle="User Detail"
      sectionTitle=""
      subTitle={user?.name || ""}
    > {user && 
        <pre>{prismaStringify(user)}</pre>
        }
    </MainLayout>
  );
};

export default UserDetail;
