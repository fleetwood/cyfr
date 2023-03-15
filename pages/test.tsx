import AdminLayout from "../components/layouts/AdminLayout";
import JsonBlock from "../components/ui/jsonBlock";
import useDebug from "../hooks/useDebug";
const {debug, info, settings} = useDebug('test','DEBUG')

// @ts-ignore
const Test = (props) => {
  return (
    <AdminLayout sectionTitle="Remirror" >
      {/* <JsonBlock data={mentions.map(m => m.name)} />
      <JsonBlock data={cyfrMentions.map(m => m.name)} /> */}
      <JsonBlock data={settings} />
    </AdminLayout>
  );
};

export default Test;