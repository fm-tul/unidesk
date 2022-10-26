import { ThesisDto } from "@api-client";
import { LanguageContext } from "@locales/LanguageContext";
import { R } from "@locales/R";
import { useContext, useState } from "react";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { ThesisFilterBar } from "filters/ThesisFilterBar";
import { useOpenClose } from "hooks/useOpenClose";
import { Button } from "ui/Button";
import { Menu } from "ui/Menu";
import { Modal } from "ui/Modal";

import { ThesisSimpleView } from "../../components/ThesisSimpleView";
import { ThesisEdit } from "./PageThesisEdit";
import { Link } from "react-router-dom";
import { link_pageThesisCreate } from "routes/links";

export const PageThesisList = () => {
  const [selectedThesis, setSelectedThesis] = useState<ThesisDto>();
  const { open, close, isOpen } = useOpenClose(false);
  const [data, setData] = useState<ThesisDto[]>([]);

  const editThesis = (thesis: ThesisDto) => {
    setSelectedThesis(thesis);
    open();
  };

  const newThesis = () => {
    setSelectedThesis(undefined);
    open();
  };

  return (
    <LoadingWrapper error={null} isLoading={false}>
      {isOpen && (
        <Modal open={isOpen} onClose={close} y="top" height="xl" className="bg-slate-100 p-6">
          <div className="flex h-full flex-col content-between">
            <ThesisEdit initialValues={selectedThesis} />
          </div>
        </Modal>
      )}

      {data && (
        <div>
          <ThesisFilterBar onChange={setData} />
          {/* <div className="flex justify-end">
            <Menu link="menu" pop="right">
              <Button text justify="justify-start" onClick={newThesis}>
                Create new thesis
              </Button>
            </Menu>
          </div> */}

          <Button component={Link} to={link_pageThesisCreate.path}>
            {R("link.create-thesis")}
          </Button>


          <h1>{R("topics")}</h1>
          {data.map(thesis => (
            <ThesisSimpleView thesis={thesis} key={thesis.id} onClick={editThesis} />
          ))}
        </div>
      )}
    </LoadingWrapper>
  );
};

export default PageThesisList;
