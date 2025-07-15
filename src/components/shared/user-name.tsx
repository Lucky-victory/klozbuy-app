import Link from "next/link";
import { VerifiedCircleIcon } from "../custom-icons/badges";

type PostOwner = {
  id: string;
  name: string;
  isVerified: boolean;
  username?: string;
};
export default function UserName({
  username,
  name,
  isVerified,
  id,
}: PostOwner) {
  return (
    <div className="flex items-center">
      <Link
        href={`/profile/${username || id}`}
        className="font-medium hover:underline mr-1 truncate"
      >
        {name || ""}
      </Link>
      {isVerified && <VerifiedCircleIcon size={22} />}
    </div>
  );
}
