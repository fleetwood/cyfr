const genres = [
  {
    title: "Adventure",
    description: "Whether through a trip, journey, or quest of some kind, your average adventure novel often focuses on both the character’s physical journey as well as the internal journey.",
    fiction: true
  },
  {
    title: "Travel",
    description: "Travel guides, travel hacks (such as how to travel for cheap or even FREE!) or in-depth reviews of different travel destinations, this genre covers places, people, food, culture and sometimes even regional history.",
    fiction: false
  },
  {
    title: "Humor",
    description: "Because laughter is the best medicine.",
    fiction: false
  },
  {
    title: "Contemporary",
    description: "This book genre is among the most popular, though most writers aren’t sure of what this category even is. It's actually more of the absence of a genre. You may have heard this genre lumped in with others, like Contemporary Fantasy or Contemporary Romance.",
    fiction: true
  },
  {
    title: "Romance",
    description: "In this book genre, the romance is the center point of the plot. The entire novel moves around the relationship, though other plot points may be present.  The requirement of a Happy Ending is the subject of some debate, though the popular consensus is by far in favor.",
    fiction: true
  },
  {
    title: "Fantasy",
    description: "Fantasy is the genre of magic. Fireballs, wizards and dragons, of course, but also lore, fairy tales, e.g. the Arthurian Legends and Alice in Wonderland, and a bajillion possibilities of wondrous worlds.",
    fiction: true
  },
  {
    title: "Dystopian",
    description: "This genre was recently popularized to describe a book genre in which the current government or society has been destroyed or subverted; the book centers around the aftermath or plight.  Writing dystopian fiction can give you a ton of freedom in how you develop society while lowering the worldbuilding you’d have to do for a fantasy or sci-fi novel.",
    fiction: true
  },
  {
    title: "Mystery",
    description: "This book genre is defined by the plot focusing on solving a mystery, most often by the main character(s).  Many other genres can have mysteries within them (in fact, most do), but in this genre, the mystery itself is the main plot and purpose.",
    fiction: true
  },
  {
    title: "Horror",
    description: "Horror stories are intended to frighten, titillate or disturb. This can be on-the-nose hack-and-slash or gore, or more psychological and subversive, or even the scintillating horror of Poe. And who doesn't love a spooky ghost story?",
    fiction: true
  },
  {
    title: "Thriller",
    description: "A good thriller is wrought with suspense, danger or dread, and often psychologically stimulating. Many have a nice juicy twist at the end as well; the twistier the juicier. Hitchcock's Psycho is a classic example, and Palahniuk's Fight Club",
    fiction: true
  },
  {
    title: "Paranormal",
    description: "Arguably the biggest distinction between Paranormal and Fantasy genres is that Paranormal embraces the possibilities of what could possibly be real. A fantasy ghost story might be perhaps more of a faerie tale, while a paranormal story more like a haunting. Clairvoyance, telekinesis, demons and vampires all fit nicely into the paranormal nomenclature; it's all about the presumption of possibility.",
    fiction: true
  },
  {
    title: "Historical Fiction",
    description: "Often historical fiction centers around well-known events or people, but whether a multi-verse or divergence or complete fiction, it is a story about a distinct time in the past.",
    fiction: true
  },
  {
    title: "Science Fiction",
    description: "Lasers, light speed and Dyson spheres do not the whole of this genre make. Yes Sci-Fi can be futuristic, it can be technological, it can be alien; but the greatest of Sci-Fi counts among the most important and most human stories ever told; viz. Harrison Bergeron, Stranger in a Strange Land and of course 1984.",
    fiction: true
  },
  {
    title: "Memoir",
    description: "Memoirs differ from autobiographies in the sense that an autobiography is more of a timeline of your life, events, and accomplishments whereas a memoir is more of a collection of the most significant moments, pulled together by a theme or message you wish to share with readers.",
    fiction: false
  },
  {
    title: "Cookbook",
    description: "Recipes. Some include the history of the dish as well. And yummy pics.",
    fiction: false
  },
  {
    title: "Art",
    description: "Picture books, art history, lessons, and of course the beloved coffee-table book. <3",
    fiction: false
  },
  {
    title: "Self-help",
    description: "From positive prayer to psychological healing, self-help is the process of empowering oneself to live the life they want or need.",
    fiction: false
  },
  {
    title: "Health",
    description: "Ranging from fitness, holistic healing, to more complex medical topics and in-depth coverage of different health conditions or treatments, this is a vast genre.",
    fiction: false
  },
  {
    title: "History",
    description: "Historical facts of any kind would fall under this category. These can be written in a more entertaining fashion, rather than a factual play-by-play textbook, or they can challenge the popular consensus of historical fact, or both! The importance of this genre cannot be overstated; \"Those who do not know their history....\"",
    fiction: false
  },
  {
    title: "Childrens Books",
    description: "Whether a picture book or written story, the audience is generally 9 years old or below, though the best of them resonate with us throughout our adulthood, and teach us about what it means to be alive in our world.",
    fiction: false
  },
  {
    title: "Religion",
    description: "There are over 4,000 religions globally, and 12 major religions, or 5. Or 4. Inarguably, they are the most prolific and impactful books of humankind.",
    fiction: false
  }
]
const covers = [
  {
    genreId: "clfu8243m0000mt0ctimmfrt8",	  // "Adventure"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156786/cyfr/v8ulauruqawzycm9bwls.png"
  },
  {
    genreId: "clfu8byo50000mt0cckrt5eiz",   // "Travel"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/c4k2shpaeddqf48gpkip.png"
  },
  {
    genreId: "clfu8byo50001mt0c2opf6udb",   // "Humor"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/ygoprcudzb8xxn2fw318.png"
  },
  {
    genreId: "clfu8byo50002mt0cyg7tbcor",   // "Contemporary"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/hkpkkttkzw7oel6gkmop.jpg"
  },
  {
    genreId: "clfu8byo50003mt0cxc5c7dxo",   // "Romance"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/ddz1hkksqlejiianivha.png"
  },
  {
    genreId: "clfu8byo50004mt0c5hel22b7",   // "Fantasy"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/yxwpvidbivknnpcewo3k.png"
  },
  {
    genreId: "clfu8byo50005mt0c0aktpnen",   // "Dystopian"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156786/cyfr/fwhkgvgo2cytnz2hnecx.png"
  },
  {
    genreId: "clfu8byo50006mt0ch09gpai2",   // "Mystery"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/t0xcomianfps9vrcxu5b.png"
  },
  {
    genreId: "clfu8byo50007mt0csl8v0em5",   // "Horror"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/bflg0vz7qesuewyk3glu.png"
  },
  {
    genreId: "clfu8byo50008mt0cezqp0av3",   // "Thriller"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/ilycomwc2u5gcfivqjlb.png"
  },
  {
    genreId: "clfu8byo50009mt0cobmnuyxv",   // "Paranormal"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/vpevd9rvhrg293dv79ly.png"
  },
  {
    genreId: "clfu8byo5000amt0ceiwcj8u0",   // "Historical Fiction"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/rwimgg0dzrjyevvqvhal.png"
  },
  {
    genreId: "clfu8byo5000bmt0cqwogyw18",   // "Science Fiction"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/zhyeycsw2marg6brakgl.png"
  },
  {
    genreId: "clfu8byo5000cmt0c88d3z7ne",   // "Memoir"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/flae1i3g3cvr6kh38exx.jpg"
  },
  {
    genreId: "clfu8byo5000dmt0ctc5ysi3i",   // "Cookbook"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/zedp62qqdpq2ljry7acr.jpg"
  },
  {
    genreId: "clfu8byo5000emt0cnybua0on",   // "Art"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156786/cyfr/ge6nqctlccx4uzbgegig.png"
  },
  {
    genreId: "clfu8byo5000fmt0cqo1l3y45",   // "Self-help"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/rj9a8qbfqnfhtio0vonm.png"
  },
  {
    genreId: "clfu8byo5000gmt0c8oboiuqu",   // "Health"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156787/cyfr/kv6azghbeyjyfbcz67ml.png"
  },
  {
    genreId: "clfu8byo5000hmt0cbxzmh7cg",   // "History"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/icxso2azk9gsrlz7irvs.png"
  },
  {
    genreId: "clfu8byo5000imt0cxf062e12",   // "Childrens Books"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156786/cyfr/ww94zxednqjnw5ryntrt.png"
  },
  {
    genreId: "clfu8byo5000jmt0c0n9c7fkc",   // "Religion"
    url: "https://res.cloudinary.com/drckf8gfc/image/upload/v1678156788/cyfr/h8nnqgkpoabmd5ebr5ve.png"
  }
]

// select genre.* 
// 	, json_agg(covers) as "covers"
// FROM "Genre" genre
// 	LEFT JOIN "Covers" covers on genre."id" = covers."genreId"
// GROUP BY genre."id"

// "clfn5vlkr000rbu7w9kb7nbl7"	"Kaliope"
// "clfn531z00000bu7w4ej6r8tw"	"Fleetwood"
// "clfr3w91g001ubu7w5dercorf"	"Saphirous"

// POSTS
// "clfn61c2p0014bu7wzl9n4nda"
// "clfr3v649001tbu7wi4bwmvvc"
// "clfshtc070003buf6m3tc6n4u"