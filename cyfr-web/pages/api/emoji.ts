import { NextApiRequest, NextApiResponse } from "next"
import useDebug from "../../hooks/useDebug"
import Emoji from "../../utils/emoji"
const [debug] = useDebug('api/emoji')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const {cat, name, group} = req.query
    const result:any[] = cat ? Emoji.byCat(cat.toString()) :
        name ? Emoji.byName(name.toString()) :
        group ? Emoji.byGroup(group.toString()) :
        Emoji.all
    debug(`api/emoji`,{cat, name, group, count: result.length})
    return res.status(200).json([...result])
}
