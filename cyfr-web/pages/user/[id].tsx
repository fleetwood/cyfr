import { Post } from "@prisma/client";
import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import UserDetailPostItem from "../../components/containers/Post/UserDetailPostItem";
import UserDetailFan from "../../components/containers/User/UserDetailFan";
import UserDetailFollow from "../../components/containers/User/UserDetailFollow";
import MainLayout from "../../components/layouts/MainLayout";
import Avatar from "../../components/ui/avatar";
import { FireIcon, HeartIcon } from "../../components/ui/icons";
import JsonBlock from "../../components/ui/jsonBlock";
import ShrinkableIconButton from "../../components/ui/shrinkableIconButton";
import useCyfrUser from "../../hooks/useCyfrUser";
import { UserDetail, Users } from "../../prisma/users";
import { log } from "../../utils/log";

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
  const {cyfrUser }= useCyfrUser()

  const followUser = () => {
    log(`followUser(${user.id},${cyfrUser?.id})`)
  }
  
  const stanUser = () => {
    log(`stanUser(${user.id},${cyfrUser?.id})`)
  }

  return (
    <MainLayout
      pageTitle="User Detail"
      sectionTitle=""
      subTitle={user?.name || ""}
    >
      {" "}
      {user && (
        <div>
          <div
            className="
            grid grid-cols-9
            mx-2 mb-4
            md:mx-4 md:mb-8
            md:p-4
            rounded-lg p-2 
            bg-base-100 bg-opacity-20 
            text-neutral-content
            "
          >
            <div className="col-span-2 mt-2 md:-mt-12">
              <Avatar user={user} sz="lg" />
            </div>
            <div className="col-span-7">
              <div className="
                flex items-start
                flex-col
                md:flex-row
                justify-between
                h-[50%]
                ">
                <div>
                  <strong>Posts:</strong> {user.posts.length}
                </div>
                <div>
                  <strong>Follows:</strong> {user.following.length}
                </div>
                <div>
                  <strong>Followers:</strong> {user.followedBy.length}
                </div>
                <div>
                  <strong>Fans:</strong> {user.fans.length}
                </div>
                <div>
                  <strong>Stans:</strong> {user.fanOf.length}
                </div>
              </div>
              <div className="
                flex 
                items-start
                md:items-end 
                justify-end 
                space-x-4 
                md:justify-start
                md:space-x-8
                md:border-t 
                border-base-content 
                border-opacity-50
                h-[50%]"
                >
                <ShrinkableIconButton
                  label="Like"
                  icon={HeartIcon}
                  className="bg-opacity-0 hover:shadow-none"
                  iconClassName="text-primary"
                  labelClassName="text-primary"
                  onClick={followUser}
                />
                <ShrinkableIconButton
                  label="Fan"
                  icon={FireIcon}
                  className="bg-opacity-0 hover:shadow-none"
                  iconClassName="text-primary"
                  labelClassName="text-primary"
                  onClick={stanUser}
                />
              </div>
            </div>
          </div>
          <Tabs defaultIndex={0}>
            <TabList className="flex justify-around">
              <Tab>
                <button className="btn btn-primary">Posts</button>
              </Tab>
              <Tab>
                <button className="btn btn-primary">Follows</button>
              </Tab>
              <Tab>
                <button className="btn btn-primary">Fans</button>
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
        </div>
      )}
    </MainLayout>
  );
};

export default UserDetail;
