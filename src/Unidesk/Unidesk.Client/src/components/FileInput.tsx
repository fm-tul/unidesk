import { GUID_EMPTY } from "@core/config";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { UserFunction } from "@models/UserFunction";
import { useContext, useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { FaFileExcel, FaFilePdf, FaFileWord, FaTimes } from "react-icons/fa";
import { Button } from "ui/Button";
import { Tooltip } from "utils/Tooltip";
import { ButtonGroup } from "./FilterBar";

type FileInputState = "empty" | "dropped" | "too-large" | "wrong-type";

export interface FileInputProps {
  label: string | JSX.Element;
  onChange: (file: File | null) => void;
  pdf?: boolean;
  types?: string[];
  maxSize?: number;
  file: File | null;
  showRemove?: boolean;
}
export const FileInput = (props: FileInputProps) => {
  const { label, pdf, maxSize = 10, types = [], onChange, file, showRemove = false } = props;
  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);
  const [state, setState] = useState<FileInputState>("empty");

  const allowedTypes = [...types];
  if (pdf) {
    allowedTypes.push("pdf");
  }

  useEffect(() => {
    if (file) {
      setState("dropped");
    }
    if (!file && state === "dropped") {
      setState("empty");
    }
  }, [file]);

  const handleChange = (file: File) => {
    onChange(file);
  };

  const onTypeError = () => {
    setState("wrong-type");
  };

  const ononSizeError = () => {
    setState("too-large");
  };

  const removeFile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    setState("empty");
    onChange(null);
  };

  const fileExtension = file?.name.split(".").pop();

  return (
    <div className="flex items-center gap-1 w-full file-input">
      <FileUploader
        label={label}
        handleChange={handleChange}
        types={allowedTypes.length == 0 ? undefined : allowedTypes}
        onTypeError={onTypeError}
        onSizeError={ononSizeError}
        onSelect={console.log}
        maxSize={maxSize}
      >
        <div className="rounded-md border-2 border-dashed border-gray-300 p-2 px-4 text-center">
          {state === "empty" && translate("common.upload.drop-files-here")}
          {state === "dropped" && (
            <div>
              <div className="flex items-center gap-1">
                {getExtensionIcon(fileExtension ?? "")}
                <div>{file?.name}</div>
              </div>
            </div>
          )}
          {state === "too-large" && translate("common.upload.error.file-too-large-x", maxSizeWithUnit(maxSize))}
          {state === "wrong-type" && translate("common.upload.error.file-not-supported-x", allowedTypes.join(", "))}
        </div>
      </FileUploader>
      {showRemove && state === "dropped" && (
        <Tooltip content={translate("common.remove-file")}>
          <Button text onClick={removeFile}>
            {/* remove */}
            <FaTimes />
          </Button>
        </Tooltip>
      )}
    </div>
  );
};

const getExtensionIcon = (extension: string) => {
  switch (extension.toLowerCase()) {
    case "pdf":
      return <FaFilePdf className="text-red-800 w-5 h-5" />;
    case "xls":
    case "xlsx":
      return <FaFileExcel className="text-green-800 w-5 h-5" />;
    case "doc":
    case "docx":
      return <FaFileWord className="text-blue-800 w-5 h-5" />;
    default:
      return null;
  }
};

const maxSizeWithUnit = (maxSizeMb: number) => {
  if (maxSizeMb < 1) {
    return `${(maxSizeMb * 1000).toFixed(0)} KB`;
  }
  return `${maxSizeMb.toFixed(0)} MB`;
};

export default FileInput;

interface FileControlProps {
  hideUpload?: boolean;
  hideDownload?: boolean;
  hideRemove?: boolean;
  hideClear?: boolean;

  onDownload?: () => void;
  onUpload?: (file: File) => void;
  onRemove?: () => void;
  onClear?: () => void;

  file: File | null;
  hasServerFile?: boolean;
  onChange: (file: File | null) => void;
  label: string | JSX.Element;

  pdf?: boolean;
  types?: string[];
  maxSize?: number;
}
export const FileControl = (props: FileControlProps) => {
  const { hideUpload, hideDownload, hideRemove, hideClear, file, hasServerFile=false, label } = props;
  const { onDownload, onUpload, onRemove, onChange, onClear } = props;
  const { pdf, types, maxSize } = props;
  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);

  return (
    <div>
      <FileInput label={label} onChange={onChange} file={file} pdf={pdf} types={types} maxSize={maxSize} />
      <ButtonGroup variant="text" size="sm">
        {/* download file from server */}
        <Button if={!hideDownload && hasServerFile} info onClick={onDownload}>
          {translate("common.download")}
        </Button>
        {/* remove file from server */}
        <Button error if={!hideRemove && hasServerFile} onConfirmedClick={onRemove}>
          {translate("common.remove-file")}
        </Button>

        {/* upload file to server */}
        <Button success if={!hideUpload && !!file} onClick={() => onUpload?.(file!)}>
          {translate("common.upload")}
        </Button>

        {/* clear file selection */}
        <Button if={!hideClear && !!file} onClick={onClear}>
          {translate("common.clear")}
        </Button>
      </ButtonGroup>
    </div>
  );
};
