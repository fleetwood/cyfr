import useDebug from "hooks/useDebug"
import { MembershipType } from "prisma/types"

const { debug } = useDebug('entities/prismaMembership')

const types = async ():Promise<MembershipType[]> => await prisma.membershipType.findMany({orderBy: { monthlyPrice: 'asc'}})

export const PrismaMembership = { types }
