import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { useContext } from "react";
import { create } from "react-modal-promise";

import { FilterBar } from "components/FilterBar";

import { Button } from "./Button";
import { Modal } from "./Modal";

export interface ConfirmProps {
  isOpen: boolean;
  onResolve: (value: any) => void;
  onReject: () => void;
}

export const Confirm = (props: ConfirmProps) => {
  const { isOpen, onResolve, onReject } = props;
  return (
    <Modal open={isOpen} onClose={() => onResolve(false)}>
      csacascs
    </Modal>
  );
};

export interface ConfirmDialogOptions {
  title?: EnKeys;
  message?: EnKeys;
  okText?: EnKeys;
  cancelText?: EnKeys;
  acceptFunc?: () => void;
  rejectFunc?: () => void;
}
export const confirmDialog = (options?: ConfirmDialogOptions): Promise<boolean> => {
  const { title="confirm-dialog.title", message="confirm-dialog.message", okText = "ok", cancelText = "cancel", acceptFunc, rejectFunc } = options ?? {};
  const Confirm = (props: ConfirmProps) => {
    const { language } = useContext(LanguageContext);
    const { isOpen, onResolve, onReject } = props;
    const resolve = () => {
      acceptFunc?.();
      onResolve(true);
    };
    const reject = () => {
      rejectFunc?.();
      onResolve(false);
    };

    return (
      <Modal open={isOpen} onClose={() => onResolve(false)} width="sm" className="rounded bg-white p-4">
        <h1 className="text-2xl font-bold">{RR(title, language)}</h1>
        <p className="text-gray-500">{RR(message, language)}</p>
        <FilterBar className="flex justify-end" text>
          <Button onClick={resolve}>{RR(okText, language)}</Button>
          <Button error onClick={reject}>
            {RR(cancelText, language)}
          </Button>
        </FilterBar>
      </Modal>
    );
  };

  return create(Confirm)();
};
