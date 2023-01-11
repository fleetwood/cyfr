import { User } from ".prisma/client";
import Link from "next/link";
import React from "react";

type AvatarProps = {
  user: User;
  sz?: "sm" | "md" | "lg";
};

const Avatar = ({ user: { id, image }, sz = "md" }: AvatarProps) => {
  const size = sz == "lg" ? 32 : sz == "md" ? 24 : 12;
  return (
    <div className="avatar">
      <div className={`w-${size} h-${size} mask mask-squircle`}>
        <Link href={`/user/${id}`}>
          <img src={image!} />
        </Link>
      </div>
    </div>
  );
};

export default Avatar;
