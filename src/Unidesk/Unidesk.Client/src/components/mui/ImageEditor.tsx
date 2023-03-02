import { FilterBar } from "components/FilterBar";
import { CSSProperties, useState } from "react";
import Cropper from "react-cropper";
import { Button } from "ui/Button";
import { classnames } from "ui/shared";

const getImageFromDataTransfer = (dataTransfer: DataTransfer) => {
  const files = dataTransfer?.items || dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file.type.includes("image")) {
      return file;
    }
  }
  return null;
};

export interface ImageEditorProps {
  value: string | undefined | null;
  onValue: (data: string) => void;
  style?: CSSProperties;
  ascpectRatio?: number;
  className?: string;
  imgClassName?: string;
}
export const ImageEditor = (props: ImageEditorProps) => {
  const { value, style, className, imgClassName, onValue, ascpectRatio = 16 / 9 } = props;
  const [cropperRef, setCropperRef] = useState<any>();
  const [editMode, setEditMode] = useState<boolean>(false);
  const [localValue, setLocalValue] = useState<string>();

  const onImageSelected = (e: any) => {
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLocalValue(reader.result as any);
      setEditMode(true);
    };
    reader.readAsDataURL(files[0]);
  };

  const onCrop = () => {
    const cropper: any = cropperRef?.cropper;
    const newData = cropper?.getCroppedCanvas()?.toDataURL();
    if (newData) {
      onValue(newData);
      setEditMode(false);
    }
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopPropagation();

    const target = e.target as HTMLDivElement;
    if (e.type === "dragenter") {
      if (getImageFromDataTransfer(e.dataTransfer)) {
        target.classList.add("selected");
      }
    } else if (e.type === "dragleave") {
      target.classList.remove("selected");
    } else if (e.type === "drop") {
      if (getImageFromDataTransfer(e.dataTransfer)) {
        onImageSelected(e);
      }
      target.classList.remove("selected");
    }
  };

  return (
    <div className={classnames("flex flex-col gap-2", className)}>
      {editMode ? (
        <>
          <input type="file" onChange={onImageSelected} />
          <Cropper
            ref={setCropperRef}
            style={style}
            initialAspectRatio={ascpectRatio}
            aspectRatio={ascpectRatio}
            src={localValue ?? value ?? ""}
            viewMode={1}
            zoomable={false}
            background={false}
          />
          <FilterBar sm text type="btn-group">
            <Button onClick={onCrop}>Crop</Button>
            <Button warning onClick={() => setEditMode(false)}>Cancel</Button>
          </FilterBar>
        </>
      ) : (
        <>
          {value ? (
            <img src={value} className={classnames(imgClassName)} />
          ) : (
            <div
              className="flex h-32 items-center justify-center rounded-md bg-gray-200 transition-all selected:bg-gray-600"
              style={style}
              onDragEnter={handleDragEvents}
              onDragLeave={handleDragEvents}
              onDrop={handleDragEvents}
              onDragOverCapture={handleDragEvents}
            >
              <div className="text-gray-400 pointer-events-none">No Image</div>
            </div>
          )}

          <FilterBar sm text type="btn-group">
            <Button onClick={() => setEditMode(true)}>Edit</Button>
            <Button error if={!!value} onClick={() => onValue("")}>
              Remove
            </Button>
          </FilterBar>
        </>
      )}
    </div>
  );
};
