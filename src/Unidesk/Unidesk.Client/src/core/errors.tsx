import { ApiError } from "@api-client";
import { SimpleJsonResponse } from "@models/SimpleJsonResponse";

export const extractErrorMessage = (error: unknown) => {
  if (error) {
    console.debug(error);
  } else {
    return null;
  }

  if (error instanceof ApiError) {
    return (error.body as SimpleJsonResponse) ?? { message: `${error.name} ${error.statusText || "Generic error"}` };
  }

  const errorDto: SimpleJsonResponse = {
    success: false,
  };

  if (error instanceof Error) {
    errorDto.message = `${error.name} - ${error.message}`;
  } else if (typeof error === "string") {
    errorDto.message = error;
  } else if (typeof error === "object") {
    return error as SimpleJsonResponse;
  } else if (error) {
    errorDto.message = `${error}`;
  }

  return errorDto;
};

export const makeMessage = (title: string, message: string) => {
  return <div>
    <h3 className="text-xl">{title}</h3>
    <p className="text-sm opacity-70">{message}</p>
  </div>
};
