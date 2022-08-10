import { ApiError, SimpleJsonResponse } from "@api-client";
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
  const errorDto = extractErrorMessage(error);
  const errorMessage = errorDto?.message;
  if (errorDto) {
    console.debug(errorDto);
  }

  return (
    <div>
      {errorMessage && (
        <span className="text-red-500">
          <code className="text-md break-words">
            <Translate value="error-occurred" />: {errorMessage}
          </code>
        </span>
      )}

      {props.isLoading && <span className="spinner-colors big"></span>}
    </div>
  );
}

const extractErrorMessage = (error: unknown) => {
  if (error) {
    console.debug(error);
  } else {
    return null;
  }

  if (error instanceof ApiError) {
    return error.body as SimpleJsonResponse;
  }

  const errorDto: SimpleJsonResponse = {
    success: false,
  };

  if (error instanceof Error) {
    errorDto.message = `${error.name} - ${error.message}`;
  } else if (typeof error === "string") {
    errorDto.message = error;
  } else if (error) {
    errorDto.message = `${error}`;
  }

  return errorDto;
};
