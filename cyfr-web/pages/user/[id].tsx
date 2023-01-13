import { Post } from "@prisma/client";
import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import UserDetailPostItem from "../../components/containers/Post/UserDetailPostItem";
import UserDetailFan from "../../components/containers/User/UserDetailFan";
import UserDetailFollow from "../../components/containers/User/UserDetailFollow";
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

const UserDetail = ({ user }: UserDetailProps) => {
  return (
    <MainLayout
      pageTitle="User Detail"
      sectionTitle=""
      subTitle={user?.name || ""}
    >
      {" "}
      {user && (
        // @ts-ignore
        <Tabs>
          <TabList className="flex justify-around">
            <Tab>
              <button className="btn btn-primary w-max">Posts</button>
            </Tab>
            <Tab>
              <button className="btn btn-primary w-max">Follows</button>
            </Tab>
            <Tab>
              <button className="btn btn-primary w-max">Fans</button>
            </Tab>
          </TabList>

          <TabPanel>
            <div className="p-2 md:p-4 rounded-lg text-base-content">
              {user.posts.map((post) => (
                <UserDetailPostItem post={post} />
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div className="p-2 md:p-4 rounded-lg text-base-content flex flex-col sm:flex-row justify-evenly">
              <div>
                <h2>Following</h2>
                {user.following.map((follow) => (
                  <UserDetailFollow follow={follow} />
                ))}
              </div>
              <div>
                <h2>Followers</h2>
                {user.followedBy.map((follow) => (
                  <UserDetailFollow follow={follow} />
                ))}
              </div>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="p-2 md:p-4 rounded-lg text-base-content flex flex-col sm:flex-row justify-evenly">
              <div>
              <h2>Fans</h2>
              {user.fans.map((fan) => (
                <UserDetailFan fan={fan} />
              ))}
              </div>
              <div>
              <h2>Stans</h2>
              {user.fanOf.map((fan) => (
                <UserDetailFan fan={fan} />
              ))}
              </div>
            </div>
          </TabPanel>
        </Tabs>
      )}
    </MainLayout>
  );
};

export default UserDetail;
