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


interface ShowConfirmOptions {
    title: string;
    message: string;
    okText?: EnKeys;
    cancelText?: EnKeys;
}
export const CreateConfirmDialog = (options: ShowConfirmOptions): Promise<boolean> => {
    const { title, message, okText="ok", cancelText="cancel" } = options;
    const Confirm = (props: ConfirmProps) => {
       const {language} = useContext(LanguageContext);
        const { isOpen, onResolve, onReject } = props;
        const resolve = () => onResolve(true);
        const reject = () => onResolve(false);

        return (
          <Modal open={isOpen} onClose={() => onResolve(false)} width="sm" className="p-4 bg-white rounded">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-gray-500">{message}</p>
            <FilterBar className="flex justify-end" text>
                <Button onClick={resolve}>{RR(okText, language)}</Button>
                <Button error onClick={reject}>{RR(cancelText, language)}</Button>
            </FilterBar>
          </Modal>
        );
    };

    return create(Confirm)();
}
