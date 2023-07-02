export type Counts = {
  _count: {
    likes: number
    shares: number
    // comments: number
  }
}

// TODO: how to get comments count....
export const CountsInclude = {
  _count: {
      select: {
          likes: true
      }
  }
}
