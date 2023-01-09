import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useCyfrUser from "../../../hooks/useCyfrUser";
import { getApi, sendApi } from "../../../utils/api";
import { log } from "../../../utils/log";
import TailwindInput from "../../forms/TailwindInput";
import TailwindTextarea from "../../forms/TailwindTextarea";

type CreatePostProps = {
  onCreate: () => Promise<void>;
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

  return cyfrUser ? (
    <div className="rounded-xl mb-3 w-full bg-primary bg-opacity-70 mix-blend-color-dodge text-primary-content">
      <div className="w-full mx-auto p-2 sm:p-6 lg:p-4">
        <form className=" flex flex-col" onSubmit={handleSubmit}>
          <TailwindInput
            label="Title"
            type="text"
            value={title}
            setValue={setTitle}
          />
          <TailwindInput
            label="Subtitle"
            type="text"
            value={subtitle}
            setValue={setSubtitle}
          />
          <TailwindTextarea
            label="What do you want to say?"
            value={content}
            setValue={setContent}
          />

          <div className="w-full grid place-items-end mt-2">
            <button
              disabled={isDisabled}
              className="btn lg:btn-sm btn-primary p-2 text-primary-content"
              onClick={handleSubmit}
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default CreatePost;
