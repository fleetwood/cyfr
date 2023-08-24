import { MembershipType } from "@prisma/client";
import { getApi } from "utils/api";

const types = async ():Promise<MembershipType[]> => await getApi('membership/types')

const useMembership = () => {
    return {
        types
    }
}

export default useMembership