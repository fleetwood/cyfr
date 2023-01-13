import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import useCyfrUser from "../../../hooks/useCyfrUser";
import { sendApi } from "../../../utils/api";
import { log } from "../../../utils/log";
import TailwindInput from "../../forms/TailwindInput";
import TailwindTextarea from "../../forms/TailwindTextarea";

type CreatePostProps = {
  onCreate: () => void;
};

const CreatePost = ({ onCreate }: CreatePostProps): JSX.Element => {
  const { cyfrUser } = useCyfrUser();
  const [title, setTitle] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isDisabled) {
      return;
    }

    const post = await sendApi("post/create", {
      title,
      subtitle,
      content,
      headerImage: null,
      authorid: cyfrUser!.id,
    });
    if (post) {
      setTitle(null);
      setSubtitle(null);
      setContent(null);
      onCreate();
    } else {
      log("Error creating post!");
    }
  };

  useEffect(() => {
    const disabled =
      !cyfrUser || !title || title.length < 1 || !content || content.length < 1;
    setIsDisabled((current) => disabled);
  }, [title, content]);

  return (
    <div
      className="mb-3 rounded-xl w-full 
      bg-primary text-primary-content 
      md:bg-blend-hard-light md:bg-opacity-80
      "
    >
      <div className="w-full mx-auto p-2 sm:p-6 lg:p-4">
        {cyfrUser && (
          <form className=" flex flex-col" onSubmit={handleSubmit}>
          <TailwindInput
            label="Title"
            type="text"
            value={title}
            setValue={setTitle}
            inputClassName="text-base-content"
          />
          <TailwindInput
            label="Subtitle"
            type="text"
            value={subtitle}
            setValue={setSubtitle}
            inputClassName="text-base-content"
          />
          <TailwindTextarea
            label="What do you want to say?"
            value={content}
            setValue={setContent}
            inputClassName="text-base-content"
          />

          <div className="w-full grid place-items-end mt-2">
            <button
              disabled={isDisabled}
              className="btn lg:btn-sm p-2 
                bg-secondary text-primary-content
                disabled:bg-opacity-40
                disabled:text-primary
                "
              onClick={handleSubmit}
            >
              Post
            </button>
          </div>
        </form>
        )}
        {!cyfrUser &&
          <>
            <h2>You are not logged in</h2>
            <p>But you can do so <Link href='/login'><button className="btn btn-secondary">here</button></Link> :)</p>
          </>
        }
      </div>
    </div>
)}
export default CreatePost;
