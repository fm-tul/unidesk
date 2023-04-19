import { Grants } from "@api-client/constants/Grants";
import { InternshipStatusAll } from "@api-client/constants/InternshipStatus";
import { GUID_EMPTY } from "@core/config";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { LanguagesId } from "@locales/common";
import { translateValFor, useTranslation } from "@locales/translationHooks";
import { InternshipDto } from "@models/InternshipDto";
import { InternshipStatus } from "@models/InternshipStatus";
import { KeywordSelector } from "components/KeywordSelector";
import Timeline from "components/Timeline";
import { RowField } from "components/mui/RowField";
import { Section } from "components/mui/Section";
import { useModel } from "hooks/useFetch";
import moment from "moment";
import { useContext } from "react";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { link_pageInternshipDetail } from "routes/links";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { TextArea } from "ui/TextArea";
import { TextField } from "ui/TextField";
import { UserSelectFormField } from "ui/UserSelectFormField";
import { UserContext } from "user/UserContext";
import { calculateDuration } from "utils/dateUtils";
import { z } from "zod";

const humanInternshipStatuses = InternshipStatusAll.filter(
  i => i.value != InternshipStatus.CANCELLED && i.value != InternshipStatus.REJECTED && i.value != InternshipStatus.REOPENED
);

const DrawTimelime = (props: { status: InternshipStatus | undefined; language: LanguagesId }) => {
  const { status, language } = props;
  const statusIndex = humanInternshipStatuses.findIndex(i => status == i.value);

  return statusIndex === -1 ? (
    <div />
  ) : (
    <Timeline className="my-4" items={humanInternshipStatuses.map(i => translateValFor(i, language))} activeIndex={statusIndex} />
  );
};

const internshipsMinDuration = 6 * 7;
const schema = z.object({
  studentId: z.string(),
  internshipTitle: z.string(),
  companyName: z.string(),
  department: z.string().optional(),
  location: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  supervisorName: z.string(),
  supervisorPhone: z.string().min(6),
  supervisorEmail: z.string().email(),
  requirements: z.string().nonempty(),
  abstract: z.string().nonempty(),
  keywords: z.array(z.any()).optional(),
});

const getInternshipMessage = (dto: InternshipDto) => {
  switch (dto.status) {
    case InternshipStatus.DRAFT:
      return null;
    case InternshipStatus.SUBMITTED:
      return "Internship application was submitted and is waiting for approval. You will be notified when it is approved.";
    case InternshipStatus.APPROVED:
      return "Internship application was approved!";
    case InternshipStatus.REJECTED:
      return "Internship application was rejected.";
    case InternshipStatus.REOPENED:
      return "Internship application was not approved and was reopened for changes. Fix the issues and submit it again.";
    case InternshipStatus.CANCELLED:
      return "Internship application was cancelled.";
    case InternshipStatus.FINISHED:
      return "Internship application was finished.";
    case InternshipStatus.DEFENDED:
      return "Internship application was finished and defended.";
    default:
      return null;
  }
};

export const PageInternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: me } = useContext(UserContext);
  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);

  const { dto, setDto, getPropsText, getHelperProps, setQuery } = useModel(
    id!,
    { student: me as any, id: id === "new" ? GUID_EMPTY : id, status: InternshipStatus.DRAFT },
    () => httpClient.internship.getOne({ id: id! }),
    (dto: InternshipDto) => httpClient.internship.upsert({ requestBody: dto }),
    () => void 0 as any,
    [id],
    schema,
    false,
    data => {
      toast.success(translate("saved"));
      if (id === "new") {
        navigate(link_pageInternshipDetail.navigate(data.id));
      }
    }
  );
  const dtoOrEmpty = dto ?? {};

  const isManager = me.grantIds.includes(Grants.Internship_Manage.id);
  const isDraft = dtoOrEmpty.status === InternshipStatus.DRAFT;
  const isReopened = dtoOrEmpty.status === InternshipStatus.REOPENED;
  const isNew = id === "new";
  const isEditable = isDraft || isReopened;
  const disabled = !isEditable;
  const getPropsTextWithType = (key: keyof InternshipDto, type?: string) => ({
    ...getPropsText(key),
    disabled,
    as: TextField,
    type,
  });

  const deleteQuery = (() => {}) as any;

  const duration = calculateDuration(dtoOrEmpty.startDate, dtoOrEmpty.endDate);
  const durationDays = duration?.asDays();
  const datesServerError = !!getHelperProps("startDate").helperText || !!getHelperProps("endDate").helperText;
  const datesInvalid = datesServerError || (durationDays != undefined && durationDays <= 0);

  const canDelete = (isDraft || me.grantIds.includes(Grants.User_SuperAdmin.id)) && id !== "new";

  const changeStatusQuery = useMutation((status: InternshipStatus) => httpClient.internship.changeStatus({ id: id!, status }), {
    onSuccess: setDto,
  });

  return (
    <div className="flex flex-col gap-2">
      {!isDraft && (
        <div>
          <div className="bg-warning-100 p-4 text-center  text-sm ring-2 ring-warning-500/30">
            {getInternshipMessage(dtoOrEmpty as InternshipDto)}
          </div>
        </div>
      )}
      <DrawTimelime status={dtoOrEmpty.status} language={language} />
      <Section title={"internship.section.general"}></Section>
      <RowField
        required
        title="internship.student"
        description={!isManager ? "internship.student.locked-description" : undefined}
        Field={
          <UserSelectFormField disabled={disabled || !isManager} value={dto?.student} onValue={v => setDto({ ...dto!, student: v[0] })} />
        }
      />
      <RowField
        required
        title="internship.title"
        Field={<FormField {...getPropsTextWithType("internshipTitle")} label={translate("internship.title")} />}
      />
      <RowField
        required
        title="internship.company-name"
        Field={<FormField {...getPropsTextWithType("companyName")} label={translate("internship.company-name")} />}
      />
      <RowField
        title="internship.department"
        Field={<FormField {...getPropsTextWithType("department")} label={translate("internship.department")} />}
      />
      <RowField
        required
        title="internship.location"
        Field={<FormField {...getPropsTextWithType("location")} label={translate("internship.location")} />}
      />

      <RowField
        required
        title="internship.period"
        Field={
          <div className="grid gap-4">
            <div className="grid grid-flow-col gap-2">
              <FormField
                {...getPropsTextWithType("startDate", "date")}
                label={translate("internship.start-date")}
                helperColor={datesInvalid}
              />
              <FormField {...getPropsTextWithType("endDate", "date")} label={translate("internship.end-date")} helperColor={datesInvalid} />
            </div>
            {durationDays != undefined && durationDays > 0 && durationDays < internshipsMinDuration && (
              <div className="bg-warning-100 p-4 text-sm text-gray-500 ring-2 ring-warning-500/30">
                {translate("internship.warning.duration-6-weeks")} ({durationDays.toFixed(0)} / {internshipsMinDuration}){" "}
                {translate("days")}
              </div>
            )}
            {durationDays != undefined && durationDays <= 0 && (
              <div className="bg-error-100 p-4 text-sm text-gray-500 ring-2 ring-error-500/30">
                {translate("internship.error.start-date-must-be-before-end-date")}
              </div>
            )}
          </div>
        }
      />
      <Section title={"internship.section.contact"}></Section>
      <RowField
        required
        title="internship.supervisor-name"
        Field={<FormField {...getPropsTextWithType("supervisorName")} label={translate("internship.supervisor-name")} />}
      />
      <RowField
        required
        title="internship.supervisor-phone"
        Field={<FormField {...getPropsTextWithType("supervisorPhone")} label={translate("internship.supervisor-phone")} />}
      />
      <RowField
        required
        title="internship.supervisor-email"
        Field={<FormField {...getPropsTextWithType("supervisorEmail")} label={translate("internship.supervisor-email")} />}
      />

      <Section title={"internship.section.job-description"}></Section>
      <RowField
        required
        title="internship.requirements"
        Field={
          <FormField
            as={TextArea}
            minRows={3}
            maxRows={10}
            disabled={disabled}
            {...getPropsText("requirements")}
            label={translate("internship.requirements")}
          />
        }
      />
      <RowField
        required
        title="internship.abstract"
        Field={
          <FormField
            as={TextArea}
            minRows={3}
            maxRows={10}
            disabled={disabled}
            {...getPropsText("abstract")}
            label={translate("internship.abstract")}
          />
        }
      />
      <RowField
        title="internship.comments"
        Field={
          <FormField
            as={TextArea}
            minRows={3}
            maxRows={10}
            disabled={disabled}
            {...getPropsText("comments")}
            label={translate("internship.comments")}
          />
        }
      />
      <RowField
        title="internship.keywords"
        Field={<KeywordSelector disabled={disabled} onChange={i => setDto({ ...dto!, keywords: i })} keywords={dto?.keywords} />}
      />

      <DrawTimelime status={dtoOrEmpty.status} language={language} />

      <div className="btn-group col-start-2 justify-end">
        <Button onClick={() => setQuery.mutate(dtoOrEmpty as InternshipDto)} loading={setQuery.isLoading} if={isDraft}>
          {dtoOrEmpty.id === GUID_EMPTY ? translate("add-new") : translate("update")}
        </Button>

        <Button onConfirmedClick={() => deleteQuery.mutate(dtoOrEmpty.id)} error loading={deleteQuery.isLoading} if={canDelete}>
          {translate("delete")}
        </Button>

        {isManager && (
          <>
            <Button
              if={dtoOrEmpty.status === InternshipStatus.SUBMITTED}
              onClick={() => changeStatusQuery.mutate(InternshipStatus.APPROVED)}
              loading={changeStatusQuery.isLoading}
              success
            >
              {translate("internship.approve-internship")}
            </Button>
            <Button
              if={dtoOrEmpty.status === InternshipStatus.SUBMITTED}
              onClick={() => changeStatusQuery.mutate(InternshipStatus.REJECTED)}
              loading={changeStatusQuery.isLoading}
              error
            >
              {translate("internship.reject-internship")}
            </Button>
            <Button
              if={dtoOrEmpty.status === InternshipStatus.APPROVED}
              onClick={() => changeStatusQuery.mutate(InternshipStatus.FINISHED)}
              loading={changeStatusQuery.isLoading}
              success
            >
              <div>
                {translate("internship.mark-as-finished")}
                {moment(dtoOrEmpty.endDate).isAfter(moment()) && (
                  <div className="text-xs">({translate("internship.warning.internalship-not-ended")})</div>
                )}
              </div>
            </Button>
            <Button
              if={dtoOrEmpty.status === InternshipStatus.FINISHED}
              onClick={() => changeStatusQuery.mutate(InternshipStatus.DEFENDED)}
              loading={changeStatusQuery.isLoading}
              success
            >
              {translate("internship.mark-as-defended")}
            </Button>
            <Button
              if={!isDraft && !isReopened}
              onClick={() => changeStatusQuery.mutate(InternshipStatus.REOPENED)}
              loading={changeStatusQuery.isLoading}
              warning
            >
              {translate("internship.reopen-internship")}
            </Button>
          </>
        )}

        <Button
          if={isEditable && !isNew}
          onClick={() => changeStatusQuery.mutate(InternshipStatus.SUBMITTED)}
          loading={changeStatusQuery.isLoading}
          success
        >
          {translate("internship.submit-for-approval")}
        </Button>
      </div>
    </div>
  );
};

export default PageInternshipDetail;
