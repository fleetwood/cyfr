import { randArray } from "./helpers"

const quotes:string[] = [
    'When someone is mean to me, I just make them a victim in my next book. \n—Mary Higgins Clark',
    'When I [little], they called me a liar, but now that I am a grown—up they call me a writer. \n—Isaac Bashevis Singer',
    'A synonym is a word you use when you can’t spell the other one. \n—Baltasar Gracián',
    'The freelance writer is [someone] who is paid per piece or per word or perhaps. \n—Robert Benchley',
    'There are three rules for writing the novel. Unfortunately, no one knows what they are. \n—W. Somerset Maugham',
    'I can shake off everything as I write; my sorrows disappear, my courage is reborn. \n—Anne Frank',
    'No Black woman writer in this culture can write ‘too much.’ Indeed, no woman writer can write ‘too much.’ \n—Bell Hooks',
    'Writing can be a lifeline, especially when your existence has been denied, especially when you have been left on the margins, especially when your life and process of growth have been subjected to attempts at strangulation. ―Micere Githae Mugo',
    'You don’t start out writing good stuff. You start out writing crap and thinking it’s good stuff, and then gradually you get better at it. That’s why I say one of the most valuable traits is persistence. ―Octavia E. Butler',
    'Write what should not be forgotten. \n—Isabel Allende',
    'Non-fiction is the world as it is; fiction is the world as it should be. \n—Unknown',
    'For truth is always strange; stranger than fiction. \n—Lord Byron',
    'Nonfiction speaks to the head. Fiction speaks to the heart. Poetry speaks to the soul. \n—Ellen Hopkins',
    'The one thing that you have that nobody else has is you. Your voice, your mind, your story, your vision. So write and draw and build and play and dance and live as only you can. \n—Neil Gaiman',
    'I took to saying, ‘Look, tell you what: Pick it up; open it anywhere. Read three pages. If you can put it down again, I‘ll pay you a dollar. So I never lost any money on that bet, but I sold a lot of books. \n—Diana Gabaldon',
    'It’s such a confidence trick, writing a novel. The main person you have to trick into confidence is yourself. This is hard to do alone. \n—Zadie Smith',
    'Be still when you have nothing to say; when genuine passion moves you, say what you‘ve got to say, and say it hot. \n—D. H. Lawrence'
]

export const quote = () => randArray(quotes)