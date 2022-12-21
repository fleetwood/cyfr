import { User } from ".prisma/client";
import { GetResponseError, ResponseResult } from "../types/Response";
import { parseResponse } from "../utils/api";
import { prisma } from "./prismaContext";

type UsersResponse = ResponseResult<User[]>;
type UserResponse = ResponseResult<User>;

const byEmail = async (email:string):Promise<UserResponse> => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email?.toString()
            },
            include: {
                posts: true
            }
        })
        if (user) {
            return parseResponse(user)
        }
        throw({code:'users/byEmail',message:`Did not find user for ${email}`})
    }
    catch(error) {
        return { error: GetResponseError(error) };
    }
}

export const Users = { byEmail }