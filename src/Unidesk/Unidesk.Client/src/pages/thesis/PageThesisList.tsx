import { ThesisLookupDto } from "@api-client";
import { R } from "@locales/R";
import { useState } from "react";
import { Link } from "react-router-dom";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { ThesisFilterBar } from "filters/ThesisFilterBar";
import { useOpenClose } from "hooks/useOpenClose";
import { link_pageThesisCreate } from "routes/links";
import { Modal } from "ui/Modal";

import PageThesisEdit from "./PageThesisEdit";
import { UnideskComponent } from "components/UnideskComponent";
import { ThesisListRenderer } from "models/itemRenderers/ThesisListRenderer";
import { FloatingAction } from "components/mui/FloatingAction";

export interface PageThesisListProps {
  myThesis?: boolean;
}
export const PageThesisList = (props: PageThesisListProps) => {
  const { myThesis } = props;
  const [selectedThesis, setSelectedThesis] = useState<ThesisLookupDto>();
  const { open, close, isOpen } = useOpenClose(false);
  const [data, setData] = useState<ThesisLookupDto[]>([]);

  const editThesis = (thesis: ThesisLookupDto) => {
    setSelectedThesis(thesis);
    open();
  };

  const newThesis = () => {
    setSelectedThesis(undefined);
    open();
  };

  return (
    <UnideskComponent name="PageThesisList">
      <LoadingWrapper error={null} isLoading={false}>
        {isOpen && (
          <Modal open={isOpen} onClose={close} y="top" height="xl" className="bg-slate-100 p-6">
            <div className="flex h-full flex-col content-between">
              <PageThesisEdit id={selectedThesis?.id} />
            </div>
          </Modal>
        )}

        {data && (
          <div>
            <ThesisFilterBar onChange={setData} initialFilter={{ myThesis: !!myThesis }} />
            <FloatingAction component={Link} to={link_pageThesisCreate.path} tooltip={R("link.create-thesis")} />
            <ThesisListRenderer onRowClick={editThesis} rows={data} />
          </div>
        )}
      </LoadingWrapper>
    </UnideskComponent>
  );
};

export default PageThesisList;
