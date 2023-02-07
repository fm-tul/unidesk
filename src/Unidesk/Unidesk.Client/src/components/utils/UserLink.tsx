import { UserLookupDto } from "@models/UserLookupDto";
import { FaLink } from "react-icons/fa";
import { Link } from "react-router-dom";
import { link_pageUserProfile } from "routes/links";

interface UserLinkProps {
  user: UserLookupDto;
}
export const UserLink = ({ user }: UserLinkProps) => {
  const { stagId } = user;

  if (stagId) {
    return (
      <>
        User is linked with Stag via id {''}
        <Link className="text-rose-700 hover:underline" to={link_pageUserProfile.navigate(user.id)}>
          {stagId}
        </Link>
      </>
    );
  }

  return (
    <>
      User is not linked with Stag:{''}
      <Link className="text-rose-700 hover:underline" to={link_pageUserProfile.navigate(user.id)}>
        {user.fullName}
        <FaLink className="ml-1 inline-block" />
      </Link>
    </>
  );
};
