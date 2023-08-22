import useDebug from "hooks/useDebug"
import { NextApiRequest, NextApiResponse } from "next"
const {debug} = useDebug('api/emoji')

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // TODO Remove if not needed.
    // const {cat, name, group} = req.query
    // const result:any[] = cat ? Emoji.byCat(cat.toString()) :
    //     name ? Emoji.byName(name.toString()) :
    //     group ? Emoji.byGroup(group.toString()) :
    //     Emoji.all
    // debug(`api/emoji`,{cat, name, group, count: result.length})
    return res.status(500).json({message: 'Not Implemented'})
}
