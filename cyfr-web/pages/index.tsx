import type { NextPage } from 'next'
import Head from 'next/head'
import MainLayout from '../components/layouts/MainLayout'
import { ResponseError } from '../types/Errors'
import { __prod__ } from '../utils/constants'

type HomePageProps = {
  title?: string, 
  content: string
}

const Home: NextPage = () => {
  const thing:ResponseError<HomePageProps> = {result: {
    title: "Home",
    content: "Jump five feet high and sideways when a shadow moves pet me pet me don't pet me. Sit on the laptop i'm bored inside, let me out i'm lonely outside, let me in i can't make up my mind whether to go in or out, guess i'll just stand partway in and partway out, contemplating the universe for half an hour how dare you nudge me with your foot?!?! leap into the air in greatest offense! meow to be let in for cats secretly make all the worlds muffins. Jump around on couch, meow constantly until given food, love yet stare at ceiling light leave dead animals as gifts take a deep sniff of sock then walk around with mouth half open. Ooooh feather moving feather! meow plop down in the middle where everybody walks get video posted to internet for chasing red dot or jump up to edge of bath, fall in then scramble in a mad panic to get out plop down in the middle where everybody walks. Destroy couch cats making all the muffins. My slave human didn't give me any food so i pooped on the floor growl at dogs in my sleep. I'm so hungry i'm so hungry but ew not for that has closed eyes but still sees you but attack the child and swat turds around the house."
  }}

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      

      <MainLayout 
        className="scroll-smooth"
        sectionTitle="Cyfr"
        subTitle="The Writer's Site"
      >
        <h1>{thing.result?.title}</h1>
        <p>{thing.result?.content}</p>
      </MainLayout>
    </div>
  )
}

export default Home
