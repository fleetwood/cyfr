import { Membership, MembershipType } from "@prisma/client"

export type MembershipStub = Membership & {
  type: MembershipType
}

export const MembershipStubInclude = {include: {
  type: true
}}
