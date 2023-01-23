import { User } from ".prisma/client";

type AvatarProps = {
  user: User;
  sz?: "wee" | "sm" | "md" | "lg";
  link?: boolean;
  shadow?: boolean;
  className?: string;
};

const Avatar = ({
  user: { id, image },
  sz = "md",
  className,
  shadow = false,
  link = true,
}: AvatarProps) => {
  const size = sz == "lg" ? 32 : sz == "md" ? 24 : sz === "wee" ? 6 : 12;
  const dropShadow = !shadow ? '' : size >= 12 ? 'drop-shadow-lg' : 'drop-shadow-md';
  return (
    <div className={`avatar ${className} ${dropShadow}`}>
      <div
        className={`w-${size} h-${size} mask mask-squircle`}
      >
        {link ? (
          <a href={`/user/${id}`}>
            <img src={image!} className={dropShadow} />
          </a>
        ) : (
          <img src={image!} className={dropShadow} />
        )}
      </div>
    </div>
  );
};

export default Avatar;
