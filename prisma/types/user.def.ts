import { Book, BookStub, Follow, GalleryStub, Membership, MembershipType, Post, PostStub, User } from "./../prismaContext"

export type UserFeed = User & {
  _count:       { sessions: number }
  membership?:  Membership
  posts:        Post[]
  follows:      Follow[]
  followers:    Follow[]
}

export const UserFeedInclude = {
  membership: true,
  posts: true,
  likes: true,
  following: true,
  follower: true,
  _count: {
    select: {
      sessions: true
    }
  }
}

export type UserDetail = User & {
  membership?:  Membership,
  posts:        PostStub[]
  canMessage:   UserStub[]
  follows:      UserFollow[]
  followers:    UserFollow[]
  galleries:    GalleryStub[]
  books:        BookStub[]
}

export type CyfrUser = User & {
  membership?:  Membership & {
    type:   MembershipType
  }
  books:        Book & {
    authors: User[]
    chapters: {
      id:     string
      title:  string
      order:  number
      active: boolean
      words:  number
    }
  }[]
  galleries: {
        id: string
        createdAt: string
        updatedAt: string
        visible: boolean
        title?: string
        description?: string
        creatorId: string,
        shareId?: string,
        _count: {
          images: number,
          likes:  number,
          shares: number
        }
  }[]
  _count: {
    posts:      number
    follower:   number
    following:  number
  }
  /*
  {
    "id": "clfw1ptdt0000buxb0tg7rntt",
    "name": "Fleetwood",
    "email": "wizening@gmail.com",
    "emailVerified": null,
    "image": "https://lh3.googleusercontent.com/a/AGNmyxZgmJ0dfcQO1_doQnkHpD-y3OmEEPS2IHPnSAoxSQ=s96-c",
    "slug": "fleetwood",
    "membershipId": "clfw1q3sl0006buxb833iqztt",
    "galleries": [
      {
        "id": "clfw27ssd000ibuxbrmv8p5j3",
        "createdAt": "2023-03-31T04:43:41.785Z",
        "updatedAt": "2023-03-31T04:43:41.785Z",
        "visible": true,
        "title": "Tattoos",
        "description": "Here’s some ink",
        "creatorId": "clfw1ptdt0000buxb0tg7rntt",
        "shareId": null,
        "_count": {
          "images": 7,
          "likes": 4,
          "shares": 2
        }
      },
      {
        "id": "clfw294li000qbuxb2nkok88q",
        "createdAt": "2023-03-31T04:44:43.782Z",
        "updatedAt": "2023-03-31T04:44:43.782Z",
        "visible": true,
        "title": "Ink",
        "description": "Here’s some inks",
        "creatorId": "clfw1ptdt0000buxb0tg7rntt",
        "shareId": null,
        "_count": {
          "images": 7,
          "likes": 0,
          "shares": 0
        }
      },
      {
        "id": "clgbccscq004dbu6075yp9c4n",
        "createdAt": "2023-04-10T21:24:03.338Z",
        "updatedAt": "2023-04-10T21:24:03.338Z",
        "visible": true,
        "title": "Testing From UI",
        "description": null,
        "creatorId": "clfw1ptdt0000buxb0tg7rntt",
        "shareId": null,
        "_count": {
          "images": 2,
          "likes": 0,
          "shares": 0
        }
      },
      {
        "id": "clgbcb8nh0001pp0iywspmzjc",
        "createdAt": "2023-04-10T21:22:51.149Z",
        "updatedAt": "2023-04-10T21:22:51.149Z",
        "visible": true,
        "title": "Testing",
        "description": null,
        "creatorId": "clfw1ptdt0000buxb0tg7rntt",
        "shareId": null,
        "_count": {
          "images": 2,
          "likes": 0,
          "shares": 0
        }
      },
      {
        "id": "clgbffdic004tbu60jme65cmr",
        "createdAt": "2023-04-10T22:50:02.882Z",
        "updatedAt": "2023-04-10T22:50:02.882Z",
        "visible": true,
        "title": "Final Test from UI",
        "description": "...I hope",
        "creatorId": "clfw1ptdt0000buxb0tg7rntt",
        "shareId": null,
        "_count": {
          "images": 9,
          "likes": 1,
          "shares": 0
        }
      }
    ],
    "books": [
      {
        "id": "clgbic8tx0003bu7mmjzkepiw",
        "createdAt": "2023-04-11T00:11:35.697Z",
        "updatedAt": "2023-04-11T00:11:35.697Z",
        "startedAt": null,
        "completeAt": "2023-05-26T05:00:00.000Z",
        "active": true,
        "status": "DRAFT",
        "prospect": true,
        "fiction": true,
        "title": "The Forstest Book",
        "slug": "the-forstest-book",
        "genreId": "clgbb9l5j0004nn0gsd78ilvj",
        "hook": "<p>Before the good book... before the bad book... hell even before the <strong>Forst Book</strong>... there was The Forstest Book</p>",
        "synopsis": "<p>A profoundly important classic of world literature, <strong>Dystopian Fiction</strong> is a searching vision of an unequal, technologically-advanced future where humans are genetically bred, socially indoctrinated, and pharmaceutically anesthetized to passively uphold an authoritarian ruling order–all at the cost of our freedom, full humanity, and perhaps also our souls.</p><p></p><p>“A genius [who] who spent his life decrying the onward march of the Machine” (<em>The New Yorker</em>), Huxley was a man of incomparable talents: equally an artist, a spiritual seeker, and one of history’s keenest observers of human nature and civilization. <strong>Dystopian Fiction</strong>, his masterpiece, has enthralled and terrified millions of readers, and retains its urgent relevance to this day as both a warning to be heeded as we head into tomorrow and as thought-provoking, satisfying work of literature. Written in the shadow of the rise of fascism during the 1930s, <strong>Dystopian Fiction</strong> likewise speaks to a 21st-century world dominated by mass-entertainment, technology, medicine and pharmaceuticals, the arts of persuasion, and the hidden influence of elites.</p><p></p><p>Sounds likes a badass book dont it. Ya it sure do.</p>",
        "back": "<p><em>The Party told you to reject the evidence of your eyes and ears. It was their final, most essential command.</em></p><p></p><p>Winston Smith toes the Party line, rewriting history to satisfy the demands of the Ministry of Truth. With each lie he writes, Winston grows to hate the Party that seeks power for its own sake and persecutes those who dare to commit <em>thoughtcrimes</em>. But as he starts to think for himself, Winston can’t escape the fact that Big Brother is always watching..</p><p></p><p>A startling and haunting read, <strong>Dystopian Novel</strong> creates an imaginary world that is completely convincing from start to finish. No one can deny the novel’s hold on the imaginations of whole generations, or the power of its admonitions—a power that seems to grow, not lessen, with the passage of time.</p><p></p><p>Was it that easy? Can’t be....</p>",
        "words": 830,
        "galleryId": null,
        "cover": null,
        "authors": [
          {
            "id": "clfw1ptdt0000buxb0tg7rntt",
            "name": "Fleetwood",
            "email": "wizening@gmail.com",
            "emailVerified": null,
            "image": "https://lh3.googleusercontent.com/a/AGNmyxZgmJ0dfcQO1_doQnkHpD-y3OmEEPS2IHPnSAoxSQ=s96-c",
            "slug": "fleetwood",
            "membershipId": "clfw1q3sl0006buxb833iqztt"
          },
          {
            "id": "clfx2w0tu0001butrfl4fyqr6",
            "name": "Saphirous",
            "email": "cyferuser2@gmail.com",
            "emailVerified": null,
            "image": "https://res.cloudinary.com/drckf8gfc/image/upload/v1681144689/cyfr/kmphwq2iripublrvhr19.jpg",
            "slug": "Saphirous",
            "membershipId": "clfx435wy0002bulvh052joc7"
          }
        ],
        "_count": {
          "chapters": 9,
          "likes": 16,
          "shares": 7
        }
      },
      {
        "id": "clgbi7urk0000bu7mn4ijlb1l",
        "createdAt": "2023-04-11T00:08:10.846Z",
        "updatedAt": "2023-04-11T00:08:10.846Z",
        "startedAt": null,
        "completeAt": null,
        "active": true,
        "status": "DRAFT",
        "prospect": false,
        "fiction": true,
        "title": "The Forst Book",
        "slug": "the-forst-book",
        "genreId": "clgbb9l5j0004nn0gsd78ilvj",
        "hook": "Before the good book, and the bad book, and the first book, there was The Forst Book",
        "synopsis": "<p>The Forst Book cometh.</p>",
        "back": "<p>Is this optional????</p>",
        "words": 3246,
        "galleryId": null,
        "cover": null,
        "authors": [
          {
            "id": "clfw1ptdt0000buxb0tg7rntt",
            "name": "Fleetwood",
            "email": "wizening@gmail.com",
            "emailVerified": null,
            "image": "https://lh3.googleusercontent.com/a/AGNmyxZgmJ0dfcQO1_doQnkHpD-y3OmEEPS2IHPnSAoxSQ=s96-c",
            "slug": "fleetwood",
            "membershipId": "clfw1q3sl0006buxb833iqztt"
          }
        ],
        "_count": {
          "chapters": 5,
          "likes": 6,
          "shares": 1
        }
      }
    ],
    "membership": {
      "id": "clfw1q3sl0006buxb833iqztt",
      "createdAt": "2023-03-31T04:29:56.278Z",
      "updatedAt": "2023-03-31T04:29:56.278Z",
      "expiresAt": null,
      "active": true,
      "level": "MEMBER"
    },
    "_count": {
      "posts": 32,
      "follower": 1,
      "following": 2
    }
  }
  */
}

export const CyfrUserInclude = {
  _count: {
    select: {
      posts: true,
      follower: true,
      following: true
    }
  },
  galleries: {
    include: {
      _count: {
        select: {
          images: true,
          likes: true,
          shares: true
        }
      }
    }
  },
  books: {
    include: {
      cover: true,
      authors: true,
      _count: {
        select: {
          chapters: true,
          likes: true,
          shares: true
        }
      }
    }
  },
  membership: true
}


export type UserStub = {
  id:     string
  name:   string
  image:  string
  slug?:  string
}

/**
 * NOTE! Use a `select` instead of `include`
 * @returns {
 *  id: String
 *  name: String
 *  image: String (url)
 *  slug: String
 * }
 */
export const UserStubSelect = {
  id: true,
  name: true,
  image: true,
  slug: true
}

/**
 * NOTE! Use a `select` instead of `include`
 * @property id: String
 * @property name: String
 * @property image: String (url)
 * @property isFan: Boolean | null
 */
export type UserFollow = UserStub & {
  isFan?: boolean
}

export type UserEngageProps = {
  followerId:   String
  followingId:  String
  isFan?:       Boolean
  active?:      Boolean
}

export type AudienceLevels = 'PUBLIC' | 'USER' | 'READER' | 'MEMBER' | 'MEMBER_EXP' | 'AGENT' | 'AGENT_EXP' | 'ADMIN' | 'OWNER'
export const audienceToLevel = (level:string) => ['PUBLIC' , 'USER' , 'READER' , 'MEMBER' , 'MEMBER_EXP' , 'AGENT' , 'AGENT_EXP' , 'ADMIN' , 'OWNER'].indexOf(level)