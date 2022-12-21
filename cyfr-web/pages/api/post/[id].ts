import { NextApiRequest, NextApiResponse } from "next";
import { log } from "../../../utils/log";

export const handle = (req:NextApiRequest, res:NextApiResponse) => {
    log('api/post/[id]',req.query.id)
}