import { Grants } from "@api-client/constants/Grants";
import { InternshipStatusAll } from "@api-client/constants/InternshipStatus";
import { GUID_EMPTY } from "@core/config";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { EnKeys } from "@locales/all";
import { LanguagesId } from "@locales/common";
import { translateValFor, useTranslation } from "@locales/translationHooks";
import { InternshipDto } from "@models/InternshipDto";
import { InternshipStatus } from "@models/InternshipStatus";
import { ButtonGroup } from "components/FilterBar";
import { KeywordSelector } from "components/KeywordSelector";
import Timeline from "components/Timeline";
import { RowField } from "components/mui/RowField";
import { Section } from "components/mui/Section";
import { useModelQuery } from "hooks/useFetch";
import { useOpenClose } from "hooks/useOpenClose";
import moment from "moment";
import { useContext } from "react";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { Modal } from "ui/Modal";
import { TextArea } from "ui/TextArea";
import { TextField } from "ui/TextField";
import { UserSelectFormField } from "ui/UserSelectFormField";
import { UserContext } from "user/UserContext";
import { calculateDuration } from "utils/dateUtils";
import { z } from "zod";
import InternshipGoals from "./InternshipGoals";
import { getPropsFactory } from "utils/forms";
import { UserFunction } from "@models/UserFunction";
import { downloadBlob } from "utils/downloadFile";
import { FaDownload } from "react-icons/fa";

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
  supervisorName: z.string().optional(),
  supervisorPhone: z.string().min(6).optional(),
  supervisorEmail: z.string().email().optional(),
  requirements: z.string().nonempty(),
  abstract: z.string().optional(),
  keywords: z.array(z.any()).optional(),
});

const getInternshipMessageKey = (dto: InternshipDto): EnKeys | null => {
  switch (dto.status) {
    case InternshipStatus.SUBMITTED:
      return "internship.status.submitted";
    case InternshipStatus.APPROVED:
      return "internship.status.approved";
    case InternshipStatus.REJECTED:
      return "internship.status.rejected";
    case InternshipStatus.REOPENED:
      return "internship.status.reopened";
    case InternshipStatus.CANCELLED:
      return "internship.status.cancelled";
    case InternshipStatus.FINISHED:
      return "internship.status.finished";
    case InternshipStatus.DEFENDED:
      return "internship.status.defended";
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
  const addingNote = useOpenClose();

  const {
    dto,
    changeDto: setDto,
    getQuery,
    setQuery,
    delQuery,
    errors,
    touched,
  } = useModelQuery({
    id: id!,
    autoToaster: true,
    translate,
    initialValues: { student: me as any, id: id === "new" ? GUID_EMPTY : id!, status: InternshipStatus.DRAFT } as InternshipDto,
    getFunc: () => httpClient.internship.getOne({ id: id! }),
    setFunc: (dto: InternshipDto) => httpClient.internship.upsert({ requestBody: dto }),
    delFunc: (id: string) => httpClient.internship.deleteOne({ id }),
  });
  const { getPropsText, getHelperProps } = getPropsFactory(dto, setDto, errors);

  const isManager = me.grantIds.includes(Grants.Internship_Manage.id);
  const isDraft = dto.status === InternshipStatus.DRAFT;
  const isReopened = dto.status === InternshipStatus.REOPENED;
  const isApproved = dto.status === InternshipStatus.APPROVED;
  const isFinishedOrDefended = dto.status === InternshipStatus.FINISHED || dto.status === InternshipStatus.DEFENDED;
  const isPartiallyEditable = [InternshipStatus.REOPENED, InternshipStatus.SUBMITTED, InternshipStatus.APPROVED].includes(dto.status!);
  const isNew = id === "new";
  const isEditable = isDraft || isReopened;
  const disabled = !isEditable;
  const getPropsTextWithType = (key: keyof InternshipDto, type?: string) => ({
    ...getPropsText(key),
    disabled,
    as: TextField,
    type,
  });
  const getPropsTextWithType2 = (key: keyof InternshipDto, type?: string) => ({
    ...getPropsText(key),
    disabled: !isPartiallyEditable && disabled,
    as: TextField,
    type,
  });

  const duration = calculateDuration(dto.startDate, dto.endDate);
  const durationDays = duration?.asDays();
  const datesServerError = !!getHelperProps("startDate").helperText || !!getHelperProps("endDate").helperText;
  const datesInvalid = datesServerError || (durationDays != undefined && durationDays <= 0);

  const canDelete = (isDraft || me.grantIds.includes(Grants.Internship_Manage.id)) && id !== "new";

  const changeStatusQuery = useMutation((status: InternshipStatus) => httpClient.internship.changeStatus({ id: id!, status }), {
    onSuccess: data => {
      setDto(data);
      toast.success(translate("saved"));
    },
  });

  const changeStatusWithNote = useMutation(
    (status: InternshipStatus) => {
      if (!isApproved) {
        return httpClient.internship.changeStatus({ id: id!, status, note: dto.note! });
      } else {
        return setQuery!.mutateAsync(dto as InternshipDto);
      }
    },
    {
      onSuccess: data => {
        setDto(data);
        addingNote.close();
        if (!isApproved) {
          toast.success(translate("saved"));
        }
      },
    }
  );

  const internshipMessage = getInternshipMessageKey(dto as InternshipDto) as EnKeys | null;

  return (
    <div className="flex flex-col gap-2">
      {!isDraft && (
        <div>
          <div className="flex flex-col  gap-1 bg-warning-100 p-4 text-sm ring-2 ring-warning-500/30">
            {internshipMessage !== null && translate(internshipMessage)}
            {!!dto.note && (
              <>
                <span className="font-bold">{translate("internship.note-from-supervisor")}: </span>
                <span>{dto.note}</span>
              </>
            )}
            {isManager && (
              <Button text sm success className="self-center" onClick={addingNote.open}>
                {translate("internship.add-note")}
              </Button>
            )}
          </div>
        </div>
      )}

      <DrawTimelime status={dto.status} language={language} />
      {isApproved && <InternshipGoals item={dto as InternshipDto} onRefreshNeeded={() => getQuery!.refetch()} needsSave={touched} />}
      {isFinishedOrDefended && (
        <div>
          <Section title={"internship.section.files-to-download"} />
          <div className="flex flex-col gap-2 items-start justify-items-stretch">
            <Button text onClick={async () => downloadBlob(await httpClient.evaluations.downloadFileInternship({ id: dto.evaluations.find(i => i.userFunction === UserFunction.AUTHOR)!.id! }))}>
              <FaDownload className="ml-2" />
              {translate("internship.download-evaluation-author")}
            </Button>
            <Button text onClick={async () => downloadBlob(await httpClient.evaluations.downloadFileInternship({ id: dto.evaluations.find(i => i.userFunction === UserFunction.SUPERVISOR)!.id! }))}>
              <FaDownload className="ml-2" />
              {translate("internship.download-evaluation-supervisor")}
            </Button>
          </div>
        </div>
      )}
      <Section title={"internship.section.general"}/>
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
        Field={<FormField {...getPropsTextWithType2("department")} label={translate("internship.department")} />}
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
      <Section title={"internship.section.contact"}/>
      <RowField
        title="internship.supervisor-name"
        Field={<FormField {...getPropsTextWithType2("supervisorName")} label={translate("internship.supervisor-name")} name="name" />}
      />
      <RowField
        title="internship.supervisor-phone"
        Field={<FormField {...getPropsTextWithType2("supervisorPhone")} label={translate("internship.supervisor-phone")} name="phone" />}
      />
      <RowField
        title="internship.supervisor-email"
        Field={
          <FormField
            {...getPropsTextWithType2("supervisorEmail")}
            label={translate("internship.supervisor-email")}
            name="email"
            type="email"
          />
        }
      />

      <Section title={"internship.section.job-description"}/>
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

      <DrawTimelime status={dto.status} language={language} />

      <div className="btn-group col-start-2 justify-end">
        <Button
          onClick={() => setQuery!.mutate(dto as InternshipDto)}
          loading={setQuery!.isLoading}
          if={isDraft || isEditable || isPartiallyEditable}
        >
          {dto.id === GUID_EMPTY ? translate("internship.create-new") : translate("internship.edit")}
        </Button>

        <Button onConfirmedClick={() => delQuery!.mutate(dto.id!)} error loading={delQuery!.isLoading} if={canDelete}>
          {translate("delete")}
        </Button>

        {isManager && (
          <>
            <Button
              if={dto.status === InternshipStatus.SUBMITTED}
              onClick={() => changeStatusQuery.mutate(InternshipStatus.APPROVED)}
              loading={changeStatusQuery.isLoading}
              success
            >
              {translate("internship.approve-internship")}
            </Button>
            <Button if={dto.status === InternshipStatus.SUBMITTED} onClick={addingNote.open} loading={changeStatusQuery.isLoading} success>
              {translate("internship.approve-internship-with-notes")}
            </Button>
            {addingNote.isOpen && (
              <Modal open={addingNote.isOpen} onClose={addingNote.close} width="sm" fullWidth cannotBeClosed>
                <h4 className="text-lg font-bold">{translate("internship.approve-internship-with-notes")}</h4>
                <TextArea
                  minRows={3}
                  label={translate("internship.approve-internship-with-notes")}
                  {...getPropsText("note")}
                  className="my-2"
                />
                <ButtonGroup variant="text" className="justify-end">
                  <Button warning onClick={addingNote.close}>
                    {translate("cancel")}
                  </Button>
                  <Button
                    success
                    onClick={() => changeStatusWithNote.mutate(InternshipStatus.APPROVED)}
                    loading={changeStatusQuery.isLoading}
                    disabled={!isApproved ? (dto?.note?.length ?? 0) <= 3 : false}
                  >
                    {translate(!isApproved ? "internship.approve-internship" : "edit")}
                  </Button>
                </ButtonGroup>
              </Modal>
            )}
            <Button
              if={dto.status === InternshipStatus.SUBMITTED}
              onClick={() => changeStatusQuery.mutate(InternshipStatus.REJECTED)}
              loading={changeStatusQuery.isLoading}
              error
            >
              {translate("internship.reject-internship")}
            </Button>
            <Button
              if={dto.status === InternshipStatus.APPROVED}
              onClick={() => changeStatusQuery.mutate(InternshipStatus.FINISHED)}
              loading={changeStatusQuery.isLoading}
              success
            >
              <div>
                {translate("internship.mark-as-finished")}
                {moment(dto.endDate).isAfter(moment()) && (
                  <div className="text-xs">({translate("internship.warning.internalship-not-ended")})</div>
                )}
              </div>
            </Button>
            <Button
              if={dto.status === InternshipStatus.FINISHED}
              onClick={() => changeStatusQuery.mutate(InternshipStatus.DEFENDED)}
              loading={changeStatusQuery.isLoading}
              success
            >
              {translate("internship.mark-as-defended")}
            </Button>
            <Button
              if={!isDraft && !isReopened && dto.status !== InternshipStatus.SUBMITTED}
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

/*
Optional: kontrola dva týdny po začátku stáže (mailem upozornit)
Supervisor Name
Supervisor Phone
Supervisor Email


po schválení možnost upravovat Kontaktní informace & Oddělení
přidat toolbar s defaulat filtrem na aktuální akademický rok


automaticky označit na jako dokončené pokud budou obsahovat
 - Potvrzení zaměstnavatele o absolvování odborné praxe
 - Závěrečná zpráva z odborné bakalářské praxe (pdf?)


dvojazyčný email


dana.skrbkova@tul.cz
marketa.janska@tul.cz
libor.tuma@tul.cz
*/
