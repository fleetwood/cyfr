export type EngageList = {
  creator: {
    id: string
    name: string | null
    image: string | null
  }
}

export const EngageInclude = { 
    select: { 
        creator: { 
            select: { 
                id: true, 
                name: true, 
                image: true
            }
        }
    }
}