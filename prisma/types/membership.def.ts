
export type MembershipStub = {
  id:         string
  expiresAt:  Date|null
  type:     MembershipTypeStub
}

export type MembershipTypeStub = {
  id:     string
  name:   string
  level:  number
}

export const MembershipStubSelect = {select: {
  id:         true,
  expiresAt:  true,
  type:       { select: {
    id:     true,
    name:   true,
    level:  true
  }}
}}
