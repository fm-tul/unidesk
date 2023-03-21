import { UserFunction as UserFunctions } from "@api-client/constants/UserFunction";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { ThesisEvaluationDto } from "@models/ThesisEvaluationDto";
import { UserLookupDto } from "@models/UserLookupDto";
import { UserFunction } from "@models/UserFunction";
import { FloatingAction } from "components/mui/FloatingAction";
import { UnideskComponent } from "components/UnideskComponent";
import { extractPagedResponse, useModel } from "hooks/useFetch";
import { renderUserLookup } from "models/cellRenderers/UserRenderer";
import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useParams } from "react-router-dom";
import { FormField } from "ui/FormField";
import { SelectField, SelectFieldLive } from "ui/SelectField";
import { Table } from "ui/Table";
import { TextField } from "ui/TextField";
import { Language } from "@models/Language";
import { Button } from "ui/Button";
import { GUID_EMPTY } from "@core/config";
import { Debug } from "components/Debug";
import { toast } from "react-toastify";
import { IdRenderer } from "models/cellRenderers/IdRenderer";
import { EvaluationStatus } from "@models/EvaluationStatus";
import { classnames } from "ui/shared";
import { useTranslation } from "@locales/translationHooks";
import { Section } from "components/mui/Section";
import { RowField } from "components/mui/RowField";
import { dateColumn } from "ui/TableColumns";
import { ButtonGroup } from "components/FilterBar";
import { z } from "zod";
import { ThesisEvaluationPeekDto } from "@models/ThesisEvaluationPeekDto";
import { link_pageEvaluationEdit, link_pageEvaluationView } from "routes/links";

const supportedUserFunctions = [UserFunctions.Opponent, UserFunctions.Supervisor, UserFunctions.External];
const initialDto = { id: GUID_EMPTY, status: EvaluationStatus.PREPARED } as ThesisEvaluationDto;
export const PageEvaluationManage = () => {
  const { id } = useParams();
  const { language } = useContext(LanguageContext);
  const { translateName, translate } = useTranslation(language);
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [dto, setDto] = useState<ThesisEvaluationDto>({ ...initialDto });

  const handleRowClick = (item: ThesisEvaluationDto) => {
    switch (item.status) {
      // can edit
      case EvaluationStatus.PREPARED:
        if (item.id === dto.id) {
          exitEditMode();
        } else {
          setDto(item);
          setEditMode(true);
        }
        break;
      // can't edit
      case EvaluationStatus.INVITED:
        return toast.warning(translate("evaluation.error-already-sent"));

      // can see evaluation
      case EvaluationStatus.ACCEPTED:
      case EvaluationStatus.DRAFT:
      case EvaluationStatus.REJECTED:
      case EvaluationStatus.SUBMITTED:
      case EvaluationStatus.APPROVED:
      case EvaluationStatus.REOPENED:
      case EvaluationStatus.PUBLISHED:
        return toast.success(translate("evaluation.error-already-sent"));
    }
  };

  const createNewEvaluation = () => {
    setDto({ ...initialDto, thesisId: id! });
    setEditMode(true);
  };

  const exitEditMode = () => {
    setDto({ ...initialDto, thesisId: dto.id! });
    setEditMode(false);
  };

  const { data: thesis } = useQuery({
    queryKey: ["thesis", id],
    queryFn: () => httpClient.thesis.getOne({ id: id! }),
    onSuccess: data => setDto({ ...dto, thesisId: data.id }),
  });

  const { data: evaluations } = useQuery({
    queryKey: ["evaluation", "thesis", id],
    queryFn: () => httpClient.evaluations.getAll({ id: id! }),
  });

  const deleteEvaluation = useMutation((id: string) => httpClient.evaluations.deleteOne({ id: id }), {
    onSuccess: () => {
      toast.success(translate("deleted"));
      queryClient.invalidateQueries(["evaluation", "thesis", id]);
      exitEditMode();
      setDto({ ...initialDto, thesisId: id! });
    },
  });

  const items = evaluations ?? [];

  return (
    <UnideskComponent name="PageEvaluationEdit">
      <h2 className="text-2xl font-bold">Evaluations for Thesis {translateName(thesis)}</h2>
      {items.length === 0 ? (
        <>{!editMode && <p className="text-xl">No evaluations yet</p>}</>
      ) : (
        <Table
          clientSort
          columns={[
            { id: "id", field: IdRenderer, headerName: "Id", style: { width: "100px" } },
            { id: "email", field: "email", headerName: "Email" },
            { id: "userFunction", field: "userFunction", headerName: "User Function" },
            { id: "language", field: "language", headerName: "Language" },
            { id: "status", field: "status", headerName: "Status" },
            { id: "rejectionReason", field: "rejectionReason", headerName: "Rejection Reason" },
            dateColumn("created", language, translate),
            dateColumn("modified", language, translate),
            {
              id: "actions",
              field: (item: ThesisEvaluationDto) => (
                <ButtonGroup className="flow" variant="text" size="sm">
                  <Button if={item.status === EvaluationStatus.PREPARED} success onClick={() => handleRowClick(item)}>
                    {translate("edit")}
                  </Button>
                  <Button if={item.status === EvaluationStatus.PREPARED} error onClick={() => deleteEvaluation.mutate(item.id)}>
                    {translate("delete")}
                  </Button>
                  <Button
                    if={item.status !== EvaluationStatus.PREPARED && item.status !== EvaluationStatus.INVITED}
                    component={Link}
                    warning
                    to={link_pageEvaluationView.navigate(item.id)}
                  >
                    {translate("view")}
                  </Button>
                </ButtonGroup>
              ),
              headerName: "Actions",
            },
          ]}
          rows={items}
          selected={dto.id}
        />
      )}
      <FloatingAction onClick={createNewEvaluation} />

      {editMode && <EvaluationRequestEditor key={dto.id!} dto={dto} thesisId={id!} onCancel={exitEditMode} />}
    </UnideskComponent>
  );
};

const evalutationRequestSchema = z.object({
  evaluatorFullName: z.string().nonempty(),
  email: z.string().email(),
  userFunction: z.nativeEnum(UserFunction),
  language: z.nativeEnum(Language),
});

interface EvaluationRequestEditorProps {
  dto: ThesisEvaluationDto;
  thesisId: string;
  onCancel: () => void;
}
const EvaluationRequestEditor = (props: EvaluationRequestEditorProps) => {
  const { onCancel, thesisId } = props;
  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);
  const [canProceed, setCanProceed] = useState(false);
  const queryClient = useQueryClient();

  const { dto, setDto, getPropsText, getPropsSelect, errors, setErrors, validateAndSetErrors, setQuery, deleteQuery } =
    useModel<ThesisEvaluationPeekDto>(
      props.dto?.id ?? GUID_EMPTY,
      props.dto,
      () => httpClient.evaluations.peek({ id: props.dto.id }),
      dto => {
        return httpClient.evaluations.upsert({ requestBody: dto }).finally(() => {
          queryClient.invalidateQueries(["evaluation", "thesis", thesisId]);
        });
      },
      (id: string) => httpClient.evaluations.deleteOne({ id: id }),
      [props.dto.id],
      evalutationRequestSchema
    );

  const changeStatusMutation = useMutation(
    (dto: ThesisEvaluationDto) => httpClient.evaluations.changeStatus({ id: dto.id, status: EvaluationStatus.INVITED }),
    {
      onSuccess: () => {
        toast.success(translate("saved"));
        queryClient.invalidateQueries(["evaluation", "thesis", thesisId]);
        onCancel();
      },
    }
  );

  const dtoOrEmpty = (dto ?? { ...initialDto, thesisId }) as ThesisEvaluationPeekDto;

  return (
    <div>
      <Section title={dtoOrEmpty.id === GUID_EMPTY ? "evaluation.add-new-evalution" : "evaluation.edit-evalution"} />
      <div className={classnames("flex flex-col gap-4")}>
        <RowField
          title="evaluation.find-existing-user"
          Field={
            <FormField
              as={SelectFieldLive<UserLookupDto>}
              value={dtoOrEmpty.evaluator}
              searchable
              clearable
              options={keyword =>
                extractPagedResponse(httpClient.users.find({ requestBody: { keyword, paging: { page: 1, pageSize: 10 } } }))
              }
              getTitle={i => renderUserLookup(i, true)}
              getValue={i => i.fullName}
              onValue={v =>
                setDto({
                  ...dto!,
                  evaluator: v[0],
                  evaluatorId: v[0]?.id,
                  email: v[0]?.email || dtoOrEmpty.email,
                  evaluatorFullName: v[0]?.fullName || dtoOrEmpty.evaluatorFullName,
                })
              }
            />
          }
        />

        <RowField title="evaluation.evaluator-name" Field={<FormField as={TextField} {...getPropsText("evaluatorFullName")} />} />
        <RowField title="evaluation.evaluator-email" Field={<FormField as={TextField} {...getPropsText("email")} />} />

        <RowField
          title="evaluation.evaluator-relation"
          Field={
            <FormField
              as={SelectField<UserFunction>}
              options={supportedUserFunctions.map(i => i.value as UserFunction)}
              searchable
              {...getPropsSelect("userFunction")}
            />
          }
        />

        <RowField
          title="evaluation.language"
          Field={<FormField as={SelectField<Language>} options={Object.values(Language)} {...getPropsSelect("language")} searchable />}
        />

        <div className="flow col-start-2 justify-end">
          <Button onClick={onCancel} color="neutral" text>
            {translate("cancel")}
          </Button>
          <Button onClick={() => setQuery.mutate(dtoOrEmpty)} loading={setQuery.isLoading}>
            {dtoOrEmpty.id === GUID_EMPTY ? translate("add-new") : translate("update")}
          </Button>
          <Button onClick={() => deleteQuery.mutate(dtoOrEmpty.id)} error loading={deleteQuery.isLoading} if={dtoOrEmpty.id !== GUID_EMPTY}>
            {translate("delete")}
          </Button>
        </div>

        <div className="col-span-2 mt-5 flex flex-col items-center gap-1">
          {dtoOrEmpty.id !== GUID_EMPTY && (
            <div className="flow">
              <input
                id="evaluation-can-proceed"
                type={"checkbox"}
                checked={canProceed}
                onChange={() => setCanProceed(!canProceed)}
                className="h-6 w-6 accent-warning-500"
              />
              <label htmlFor="evaluation-can-proceed"> I'm ready to send the request to the evaluator</label>
            </div>
          )}
          <Button
            if={canProceed}
            lg
            warning
            onClick={() => changeStatusMutation.mutate(dtoOrEmpty)}
            loading={changeStatusMutation.isLoading}
          >
            Save Evaluation Request &amp; Open for evaluation for the evaluator
          </Button>
        </div>
      </div>
      <Debug value={dto} />
    </div>
  );
};

export default PageEvaluationManage;
