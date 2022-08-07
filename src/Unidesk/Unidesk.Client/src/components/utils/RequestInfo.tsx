import { ApiError } from "@api-client";
import { Translate } from "@locales/R";

interface RequestInfoProps {
  error: unknown;
  isLoading: boolean;
}

export function RequestInfo(props: RequestInfoProps) {
  const { error, isLoading } = props;
  if (!error && !isLoading) {
    return null;
  }

  // try to extract error message from error object
  const errorMessage = extractErrorMessage(error);

  return (
    <div>
      {errorMessage && (
        <span className="text-red-500">
          <Translate value="error-occurred" />: {errorMessage}
        </span>
      )}

      {props.isLoading && <span className="spinner-colors big"></span>}
    </div>
  );
}

const extractErrorMessage = (error: unknown) => {
  if (error) {
    console.debug(error);
  }

  if (error instanceof ApiError) {
    return `${error.name} - ${error.message}, while loading ${error.request.url}`;
  } else if (error instanceof Error) {
    return `${error.name} - ${error.message}`;
  } else if (typeof error === "string") {
    return error;
  } else if (error) {
    return `${error}`;
  }

  return null;
};
