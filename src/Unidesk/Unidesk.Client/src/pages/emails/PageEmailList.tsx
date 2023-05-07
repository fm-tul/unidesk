import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { EmailMessageDto } from "@models/EmailMessageDto";
import { EmailStatus } from "@models/EmailStatus";
import { ButtonGroup } from "components/FilterBar";
import { IdRenderer } from "models/cellRenderers/IdRenderer";
import { useContext, useState } from "react";
import { useQuery } from "react-query";
import { Button } from "ui/Button";
import { Modal } from "ui/Modal";
import { Table } from "ui/Table";
import { dateColumn } from "ui/TableColumns";
import { formatDate } from "utils/dateUtils";
import { enrichPlaintext } from "utils/stringUtils";
import sanitizeHtml from 'sanitize-html';

export interface PageEmailProps {}
export const PageEmailList = () => {
  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);
  const [emailDetail, setEmailDetail] = useState<EmailMessageDto | null>(null);

  const { data } = useQuery({
    queryKey: ["emails"],
    queryFn: () => httpClient.email.find({ requestBody: { paging: { page: 1, pageSize: 20 } } }),
  });

  const close = () => setEmailDetail(null);

  const items = data?.items ?? [];

  return (
    <div>
      <Table
        rows={items}
        onRowClick={setEmailDetail}
        columns={[
          { id: "id", field: IdRenderer, headerName: "Id", style: { width: "100px" } },
          { id: "from", field: "from", headerName: "From" },
          { id: "to", field: "to", headerName: "To" },
          { id: "subject", field: "subject", headerName: "Subject" },
          { id: "status", field: "status", headerName: "Status" },
          { id: "module", field: "module", headerName: "Module" },

          dateColumn("created", language, translate),
          dateColumn("modified", language, translate),
          {
            id: "actions",
            headerName: "Actions",
            field: () => (
              <ButtonGroup variant="text" size="sm">
                {/* <Button onClick={() => {}}>Resend</Button> */}
              </ButtonGroup>
            ),
          },
        ]}
      />
      {emailDetail && (
        <Modal open={true} onClose={close} height="auto" width="lg" className="rounded bg-white p-6">
          <div className="grid grid-cols-[120px_1fr] text-sm">
            <span className="col-span-2">Subject: </span>
            <span className="col-span-2 mb-2 text-lg">{emailDetail.subject}</span>

            <span>From</span>
            <span>{emailDetail.from}</span>

            <span>To</span>
            <span>{emailDetail.to}</span>

            <span>Module</span>
            <span>{emailDetail.module}</span>

            <span>Status</span>
            <span>{emailDetail.status}</span>

            <span>Retries</span>
            <span>{emailDetail.attemptCount}×</span>

            <span>Scheduled time</span>
            {emailDetail.scheduledToBeSent ? formatDate(emailDetail.scheduledToBeSent, "long") : "Not date provided"}

            {emailDetail.status === EmailStatus.SENT && (
              <>
                <span>Sent at</span>
                {emailDetail.lastAttempt ? formatDate(emailDetail.lastAttempt, "long") : "Not date provided"}
              </>
            )}

            <div className="prose col-span-2 mt-2 whitespace-pre-wrap rounded bg-neutral-100 p-4 ring-2 ring-neutral-300 min-w-md" 
            dangerouslySetInnerHTML={{ __html: enrichPlaintext(sanitizeHtml(emailDetail.body ?? "")) }} />
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={close} text>
              {translate("close")}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PageEmailList;
