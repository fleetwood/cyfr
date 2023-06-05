export type EngageList = {
  author: {
    id: string
    name: string | null
    image: string | null
  }
}

export const EngageInclude = { 
    select: { 
        author: { 
            select: { 
                id: true, 
                name: true, 
                image: true
            }
        }
    }
}