import { Account, Follow, User } from ".prisma/client";
import { Fan, Post } from "@prisma/client";
import { ResponseResult, GetResponseError } from "../types/response";
import { prisma } from "./prismaContext";

export type UsersResponse = ResponseResult<User[]>;
export type UserResponse = ResponseResult<User>;
export type UserWithPosts = (User & {
    posts: Post[]
})
export type UserDetail = (User & {
    posts: Post[]
    following: Follow[]
    followedBy: Follow[]
    fans: Fan[]
    fanOf: Fan[]
})

const byId = async (id:string):Promise<UserDetail> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: id?.toString()
            },
            include: {
                posts: true,
                following: true,
                followedBy: true,
                fanOf: true,
                fans: true,
            }
        })
        if (!user) {
            throw({code:'users/byId',message:`Did not find user for ${id}`})
        }
        return user!;
    }
    catch(error) {
        throw GetResponseError(error)
    }
}

const byEmail = async (email:string):Promise<UserWithPosts|null> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email?.toString()
            },
            include: {
                posts: true
            }
        })
        if (!user) {
            throw({code:'users/byEmail',message:`Did not find user for ${email}`})
        }
        return user;
    }
    catch(error) {
        throw GetResponseError(error)
    }
}

export const Users = { byEmail, byId }