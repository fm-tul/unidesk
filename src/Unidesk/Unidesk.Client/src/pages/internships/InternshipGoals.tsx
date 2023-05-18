import { Grants } from "@api-client/constants/Grants";
import { EvaluationStatus, UserFunction } from "@api-client/index";
import { GUID_EMPTY } from "@core/config";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { InternshipDto } from "@models/InternshipDto";
import { FileControl } from "components/FileInput";
import { ButtonGroup } from "components/FilterBar";
import { Section } from "components/mui/Section";
import { DateOnlyRenderer } from "models/cellRenderers/DateOnlyRenderer";
import { useContext, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { Button } from "ui/Button";
import { UserContext } from "user/UserContext";
import { formatDateRelative } from "utils/dateUtils";
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
  const [finalReportEditMode, setFinalReportEditMode] = useState(false);
  const { user: me } = useContext(UserContext);
  const meIsManager = me.grantIds.includes(Grants.Internship_Manage.id);

  const evaluations = item.evaluations ?? [];
  const finalReportEvaluation = evaluations.find(i => i.userFunction === UserFunction.AUTHOR && i.status === EvaluationStatus.APPROVED);
  const supervisorEvaluation = evaluations.find(i => i.userFunction === UserFunction.SUPERVISOR);

  const supervisorApproved = supervisorEvaluation?.status === EvaluationStatus.APPROVED;
  const supervisorEvaluated = supervisorApproved || supervisorEvaluation?.status === EvaluationStatus.SUBMITTED;
  const supervisorInvited = !!supervisorEvaluation;
  const uploadFinalReport = !!finalReportEvaluation;
  const waitUntilInternshipEnds = new Date() > new Date(item.endDate);

  const isContantPersonFilled = isAllNotNullOrEmpty(item.supervisorEmail, item.supervisorName, item.supervisorPhone);

  const uploadMutation = useMutation(async (file: File) => {
    await httpClient.evaluations.uploadAuthorFileInternship({
      internshipId: item.id!,
      evaluationId: finalReportEvaluation?.id ?? GUID_EMPTY,
      formData: { file },
    });
    onRefreshNeeded();
  });

  const removeMutation = useMutation(async () => {
    await httpClient.evaluations.removeFileInternship({ id: finalReportEvaluation!.id });
    onRefreshNeeded();
  });

  const downloadMutation = useMutation(async () => {
    const blob = await httpClient.evaluations.downloadFileInternship({
      id: finalReportEvaluation!.id,
    });
    downloadBlob(blob);
  });

  return (
    <div className=" p-4">
      <Section title={"internship.section.next-steps"}></Section>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 p-2 transition-colors hover:bg-yellow-100">
          {waitUntilInternshipEnds ? <FaCheck className="text-success-700" /> : <FaTimes className="text-error-700" />}
          <span>{translate("internship.next-steps.wait-until-internship-ends")}</span>
          <div className="ml-auto">
            {!waitUntilInternshipEnds && formatDateRelative(item.endDate)}
          </div>
        </div>
        <div className="flex items-center gap-2 p-2 transition-colors hover:bg-yellow-100">
          {uploadFinalReport ? <FaCheck className="text-success-700" /> : <FaTimes className="text-error-700" />}
          <span>{translate("internship.next-steps.upload-final-report")}</span>
          <div className="ml-auto">
            {finalReportEditMode || !uploadFinalReport ? (
              <FileControl
                file={finalReport}
                pdf
                hasServerFile={uploadFinalReport}
                onChange={setFinalReport}
                label={translate("internship.next-steps.upload-final-report")}
                onDownload={() => downloadMutation.mutate()}
                onRemove={() => removeMutation.mutate()}
                onUpload={() => uploadMutation.mutate(finalReport!)}
                onClear={() => setFinalReport(null)}
                downloadLoading={downloadMutation.isLoading}
                removeLoading={removeMutation.isLoading}
                uploadLoading={uploadMutation.isLoading}
              />
            ) : (
              <ButtonGroup variant="text" size="sm">
                <Button success onClick={() => setFinalReportEditMode(true)}>
                  {translate("edit")}
                </Button>
                <Button onClick={() => downloadMutation.mutate()}>{translate("common.download")}</Button>
              </ButtonGroup>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 transition-colors hover:bg-yellow-100">
          {supervisorInvited ? <FaCheck className="text-success-700" /> : <FaTimes className="text-error-700" />}
          <span>{translate("internship.next-steps.invite-supervisor-to-evaluate")}</span>
          <div className="ml-auto">
            <>
              {supervisorInvited ? (
                <>
                  {!supervisorApproved && <span className="text-success-800">{translate("internship.next-steps.supervisor-invited")}</span>}
                </>
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
                              onRefreshNeeded();
                            } else {
                              toast.error(translate("common.error.failed-to-send-invitation"));
                              onRefreshNeeded();
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
          {supervisorEvaluated ? <FaCheck className="text-success-700" /> : <FaTimes className="text-error-700" />}
          <span>{translate("internship.next-steps.wait-for-supervisor-to-evaluate")}</span>
        </div>

        <div className="flex items-center gap-2 p-2 transition-colors hover:bg-yellow-100">
          {supervisorApproved ? <FaCheck className="text-success-700" /> : <FaTimes className="text-error-700" />}
          <span>{translate("internship.next-steps.wait-for-manager-to-approve")}</span>

          <div className="ml-auto">
            <div className="ml-auto">
              <ButtonGroup variant="text" size="sm">
                {/* approve */}
                <Button
                  if={supervisorEvaluated && !supervisorApproved && meIsManager}
                  success
                  onClick={async () => {
                    await httpClient.evaluations.changeStatus({
                      id: supervisorEvaluation!.id,
                      status: EvaluationStatus.APPROVED,
                    });
                    onRefreshNeeded();
                  }}
                >
                  {translate("common.approve")}
                </Button>

                {/* reject */}
                <Button
                  if={supervisorEvaluated && !supervisorApproved && meIsManager}
                  error
                  onConfirmedClick={async () => {
                    await httpClient.evaluations.changeStatus({
                      id: supervisorEvaluation!.id,
                      status: EvaluationStatus.REOPENED,
                    });
                    onRefreshNeeded();
                  }}
                >
                  {translate("common.reject")}
                </Button>

                {/* download */}
                <Button
                  if={(supervisorEvaluated && meIsManager) || supervisorApproved}
                  onClick={async () => downloadBlob(await httpClient.evaluations.downloadFileInternship({ id: supervisorEvaluation!.id }))}
                >
                  {translate("common.download")}
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipGoals;
