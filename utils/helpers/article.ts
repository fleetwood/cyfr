import {ArticleType} from "prisma/prismaContext";

export const defaultBanners = (type: ArticleType): { type: ArticleType; image: string } => {
  const defaults: { type: ArticleType; image: string }[] = [
    {
      type: 'Article',
      image:
        'https://res.cloudinary.com/drckf8gfc/image/upload/v1692405154/CyfrArticles_frzr17.png',
    },
    {
      type: 'Review',
      image:
        'https://res.cloudinary.com/drckf8gfc/image/upload/v1692405154/CyfrReviews_mmqdjo.png',
    },
    {
      type: 'News',
      image:
        'https://res.cloudinary.com/drckf8gfc/image/upload/v1692400755/cyfr/CyfrNews_vx7n37.png',
    },
    {
      type: 'Knowledge',
      image:
        'https://res.cloudinary.com/drckf8gfc/image/upload/v1692400755/cyfr/CyfrLearn_sue08m.png',
    },
  ]
  return defaults.find((b) => b.type === type) ?? defaults[0]
}
