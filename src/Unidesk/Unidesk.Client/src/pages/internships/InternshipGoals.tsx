import { EvaluationStatus, UserFunction } from "@api-client/index";
import { GUID_EMPTY } from "@core/config";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { InternshipDto } from "@models/InternshipDto";
import { FileControl } from "components/FileInput";
import { Section } from "components/mui/Section";
import { useContext, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { Button } from "ui/Button";
import { downloadBlob } from "utils/downloadFile";
import { isAllNotNullOrEmpty } from "utils/stringUtils";

export interface InternshipGoalsProps {
  item: InternshipDto;
  onRefreshNeeded: () => void;
  needsSave: boolean;
}
export const InternshipGoals = (props: InternshipGoalsProps) => {
  const { item, onRefreshNeeded, needsSave } = props;
  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);
  const [finalReport, setFinalReport] = useState<File | null>(null);

  const evaluations = item.evaluations ?? [];
  const finalReportEvaluation = evaluations.find(i => i.userFunction === UserFunction.AUTHOR && i.status === EvaluationStatus.APPROVED);
  const supervisorEvaluation = evaluations.find(i => i.userFunction === UserFunction.SUPERVISOR);
  const goals = {
    uploadFinalReport: !!finalReportEvaluation,
    supervisorInvited: !!supervisorEvaluation,
    supervisorEvaluated: supervisorEvaluation?.status === EvaluationStatus.SUBMITTED,
  };

  const isContantPersonFilled = isAllNotNullOrEmpty(item.supervisorEmail, item.supervisorName, item.supervisorPhone);

  return (
    <div className="bg-warning-50 p-4">
      <Section title={"internship.section.next-steps"}></Section>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 p-2 transition-colors hover:bg-yellow-100">
          {goals.uploadFinalReport ? <FaCheck className="text-success-700" /> : <FaTimes className="text-error-700" />}
          <span>{translate("internship.next-steps.upload-final-report")}</span>
          <div className="ml-auto">
            <FileControl
              file={finalReport}
              pdf
              hasServerFile={goals.uploadFinalReport}
              onChange={setFinalReport}
              label={translate("internship.next-steps.upload-final-report")}
              onDownload={async () => {
                downloadBlob(
                  await httpClient.evaluations.downloadFileInternship({
                    id: finalReportEvaluation!.id,
                  })
                );
              }}
              onRemove={async () => {
                const result = await httpClient.evaluations.removeFileInternship({ id: finalReportEvaluation!.id });
                if (result) {
                  toast.success(translate("common.file-removed-from-server"));
                } else {
                  toast.error(translate("common.error.failed-to-remove-file-from-server"));
                }
                onRefreshNeeded();
              }}
              onUpload={async file => {
                await httpClient.evaluations.uploadFileInternship({
                  internshipId: item.id!,
                  evaluationId: finalReportEvaluation?.id ?? GUID_EMPTY,
                  formData: { file },
                });
                onRefreshNeeded();
              }}
              onClear={() => setFinalReport(null)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 transition-colors hover:bg-yellow-100">
          {goals.supervisorInvited ? <FaCheck className="text-success-700" /> : <FaTimes className="text-error-700" />}
          <span>{translate("internship.next-steps.invite-supervisor-to-evaluate")}</span>
          <div className="ml-auto">
            <>
              {goals.supervisorInvited ? (
                <span className="text-success-800">{translate("internship.next-steps.supervisor-invited")}</span>
              ) : (
                <>
                  {!isContantPersonFilled ? (
                    <span className="text-error-800">{translate("internship.next-steps.supervisor-contact-info-not-filled")}</span>
                  ) : (
                    <>
                      {needsSave ? (
                        <span className="text-error-800">{translate("common.save-first-before-contiuining")}</span>
                      ) : (
                        <Button
                          text
                          if={isContantPersonFilled}
                          onClick={async () => {
                            const result = await httpClient.evaluations.inviteSupervisorToInternship({
                              internshipId: item.id!,
                              evaluationId: GUID_EMPTY,
                            });
                            if (result) {
                              toast.success(translate("common.invitation-sent"));
                            } else {
                              toast.error(translate("common.error.failed-to-send-invitation"));
                            }
                          }}
                        >
                          Invite
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 transition-colors hover:bg-yellow-100">
          {goals.supervisorEvaluated ? <FaCheck className="text-success-700" /> : <FaTimes className="text-error-700" />}
          <span>{translate("internship.next-steps.wait-for-supervisor-to-evaluate")}</span>
          <div className="ml-auto">
            <Button
              text
              sm
              if={goals.supervisorEvaluated}
              onClick={async () => downloadBlob(await httpClient.evaluations.downloadFileInternship({ id: supervisorEvaluation!.id }))}
            >
              {translate("common.download")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipGoals;
