import AdminLayout from "../components/layouts/AdminLayout";
// import useDebug from "../hooks/useDebug";

// const {debug, info, error, fileMethod} = useDebug({fileName: 'test', level: 'DEBUG'})

const Test = () => {
  // const [cyfrUser] = useCyfrUser()
  // const [mentions, setMentions] = useState<User[]>([])
  // const [cyfrMentions, setCyfrMentions] = useState<User[]>([])

  // const mapMentions = async() => {
  //   if (!cyfrUser) {
  //     return []
  //   }
  //   debug('mapMentions', {following: cyfrUser.following.length, fans: cyfrUser.fans.length})

  //   const list= await (await getApi('user/mentions')).result
  //   if (list) {
  //       setMentions((c) => list)
  //   }

  //   const cm = dedupe([
  //     ...cyfrUser.following.map((f) => f.follower),
  //     ...cyfrUser.fans.map((f) => f.fan)
  //   ], 'id')
  //   .slice(0,10) as unknown as User[]

  //   setCyfrMentions(() => cm)
  // }

  // useEffect(() => {
  //   mapMentions()
  // }, [cyfrUser])

  return (
    <AdminLayout sectionTitle="Remirror" >
      {/* <JsonBlock data={mentions.map(m => m.name)} />
      <JsonBlock data={cyfrMentions.map(m => m.name)} /> */}
    </AdminLayout>
  );
};

export default Test;