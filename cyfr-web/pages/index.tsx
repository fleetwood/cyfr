import CreatePost from "../components/containers/Post/CreatePost";
import MainPagePostListItem from "../components/containers/Post/MainPagePostListItem";
import MainLayout from "../components/layouts/MainLayout";
import usePostsApi from "../hooks/usePostsApi";
import { __prod__ } from "../utils/constants";

const Home = () => {
  const { posts, error, invalidate } = usePostsApi();

  return (
    <MainLayout sectionTitle="Cyfr" subTitle="The Writer's Site">
      <CreatePost onCreate={invalidate} />
      {posts &&
        posts.map((post) => <MainPagePostListItem {...post} key={post.id} />)}
    </MainLayout>
  );
};

export default Home;
