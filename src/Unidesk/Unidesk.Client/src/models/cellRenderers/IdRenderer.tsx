import { Tooltip } from "@mui/material";

export const IdRenderer = (params: any) => {
  // something like this: 52ffd7b8-98cb-4857-bd06-174bb2844afb
  const { id } = params;

  // if the id is not a valid uuid, return the id as is
  // othersise return first and last 3 characters of the uuid
  return (
    <Tooltip title={id}>
      <span className="text-xs text-gray-600">
        {id.length === 36 ? (
          <>
            {id.substring(0, 4)}&hellip;{id.substring(id.length - 4)}
          </>
        ) : (
          id
        )}
      </span>
    </Tooltip>
  );
};
