import { Account, User } from ".prisma/client";
import { Post } from "@prisma/client";
import { ResponseResult, GetResponseError } from "../types/response";
import { prisma } from "./prismaContext";

export type UsersResponse = ResponseResult<User[]>;
export type UserResponse = ResponseResult<User>;
export type UserWithPosts = (User & {
    posts: Post[]
})

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

export const Users = { byEmail }