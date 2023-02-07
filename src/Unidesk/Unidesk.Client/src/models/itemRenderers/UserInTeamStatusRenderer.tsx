import { UserInTeamStatus } from "@models/UserInTeamStatus";

export const UserInTeamStatusRenderer = (status: UserInTeamStatus) => {
  switch (status) {
    case UserInTeamStatus.ACCEPTED:
      return <div className="text-green-600 text-center text-xs bg-green-100 p-0.5">Accepted</div>;
    case UserInTeamStatus.PENDING:
      return <div className="text-yellow-600 text-center text-xs bg-yellow-100 p-0.5">Pending</div>;
    case UserInTeamStatus.DECLINED:
    case UserInTeamStatus.REMOVED:
      return <div className="text-red-600 text-center text-xs bg-red-100 p-0.5">Rejected</div>;
    case UserInTeamStatus.REQUESTED:
      return <div className="text-blue-600 text-center text-xs bg-blue-100 p-0.5">Requested</div>;
    default:
      return <div className="text-gray-600 text-center text-xs bg-gray-100 p-0.5">Unknown</div>;
  }
};
