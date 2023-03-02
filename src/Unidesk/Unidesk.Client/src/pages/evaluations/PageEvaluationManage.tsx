import { UserFunction as UserFunctions } from "@api-client/constants/UserFunction";
import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { ThesisEvaluationDto } from "@models/ThesisEvaluationDto";
import { UserLookupDto } from "@models/UserLookupDto";
import { UserFunction } from "@models/UserFunction";
import { FloatingAction } from "components/mui/FloatingAction";
import { UnideskComponent } from "components/UnideskComponent";
import { extractPagedResponse } from "hooks/useFetch";
import { renderUserLookup } from "models/cellRenderers/UserRenderer";
import { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
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
import { CreatedRenderer, ModifiedRenderer } from "models/cellRenderers/MetadataRenderer";
import { MdCalendarToday } from "react-icons/md";
import { EvaluationStatus } from "@models/EvaluationStatus";
import { classnames } from "ui/shared";
import { SimpleJsonResponse } from "@models/SimpleJsonResponse";
import { FormErrors, extractErrors, getPropsFactory } from "utils/forms";
import { useTranslation } from "@locales/translationHooks";
import { Section } from "components/mui/Section";
import { RowField } from "components/mui/RowField";

const supportedUserFunctions = [UserFunctions.Opponent, UserFunctions.Supervisor, UserFunctions.External];
const initialDto = { id: GUID_EMPTY, status: EvaluationStatus.PREPARED } as ThesisEvaluationDto;
export const PageEvaluationManage = () => {
  const { id } = useParams();
  const { language } = useContext(LanguageContext);
  const { translateName, translateVal, translate } = useTranslation(language);
  const queryClient = useQueryClient();

  const [editMode, setEditMode] = useState(false);
  const [dto, setDto] = useState<ThesisEvaluationDto>({ ...initialDto });
  const [canProceed, setCanProceed] = useState(false);
  const [validationErrors, setValidationErrors] = useState<FormErrors<ThesisEvaluationDto>>();
  const formProps = getPropsFactory(dto, setDto, validationErrors);

  const enterEditMode = (item: ThesisEvaluationDto) => {
    if (item.status !== EvaluationStatus.PREPARED) {
      toast.warning(translate("evaluation.error-already-sent"));
    } else {
      setDto(item);
      setEditMode(true);
    }
  };

  const createNewEvaluation = () => {
    setDto({ ...initialDto, thesisId: id! });
    setEditMode(true);
  };

  const exitEditMode = () => {
    setDto({ ...initialDto, thesisId: id! });
    setEditMode(false);
    setCanProceed(false);
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

  const updateEvaluation = useMutation((dto: ThesisEvaluationDto) => httpClient.evaluations.upsert({ requestBody: dto }), {
    onSuccess: () => {
      toast.success(translate("saved"));
      queryClient.invalidateQueries(["evaluation", "thesis", id]);
      exitEditMode();
    },
    onError: (e: SimpleJsonResponse) => setValidationErrors(extractErrors(e)),
  });

  const changeStatusMutation = useMutation(
    (dto: ThesisEvaluationDto) => httpClient.evaluations.changeStatus({ id: dto.id, status: EvaluationStatus.INVITED }),
    {
      onSuccess: () => {
        toast.success(translate("saved"));
        queryClient.invalidateQueries(["evaluation", "thesis", id]);
        exitEditMode();
      },
    }
  );

  const deleteEvaluation = useMutation((id: string) => httpClient.evaluations.deleteOne({ id: id }), {
    onSuccess: () => {
      toast.success(translate("deleted"));
      queryClient.invalidateQueries(["evaluation", "thesis", id]);
      exitEditMode();
    },
  });

  const handleProceedClick = () => {
    changeStatusMutation.mutate(dto);
  };
  const items = evaluations ?? [];

  return (
    <UnideskComponent name="PageEvaluationEdit">
      <h2 className="text-2xl font-bold">Evaluations for Thesis {translateName(thesis)}</h2>
      {items.length === 0 ? (
        <>{!editMode && <p className="text-xl">No evaluations yet</p>}</>
      ) : (
        <Table
          columns={[
            { id: "id", field: IdRenderer, headerName: "Id", style: { width: "100px" } },
            { id: "email", field: "email", headerName: "Email" },
            { id: "userFunction", field: "userFunction", headerName: "User Function" },
            { id: "language", field: "language", headerName: "Language" },
            { id: "status", field: "status", headerName: "Status" },
            { id: "rejectionReason", field: "rejectionReason", headerName: "Rejection Reason" },
            {
              id: "created",
              field: v => CreatedRenderer(v, language),
              headerName: (
                <span className="flow">
                  <MdCalendarToday /> {translate("created")}
                </span>
              ),
              style: { width: 90 },
              className: "",
            },
            {
              id: "modified",
              field: v => ModifiedRenderer(v, language),
              headerName: (
                <span className="flow">
                  <MdCalendarToday /> {translate("modified")}
                </span>
              ),
              style: { width: 90 },
              className: "",
            },
          ]}
          rows={items}
          onRowClick={i => enterEditMode(i)}
          selected={dto.id}
        />
      )}
      <FloatingAction onClick={createNewEvaluation} />

      {editMode && (
        <div>
          <Section title={dto.id === GUID_EMPTY ? "evaluation.add-new-evalution" : "evaluation.edit-evalution"} />
          <div className={classnames("flex flex-col gap-4")}>
            <RowField
              title="evaluation.find-existing-user"
              Field={
                <FormField
                  as={SelectFieldLive<UserLookupDto>}
                  value={dto.evaluator}
                  searchable
                  clearable
                  options={keyword =>
                    extractPagedResponse(httpClient.users.find({ requestBody: { keyword, paging: { page: 1, pageSize: 10 } } }))
                  }
                  getTitle={i => renderUserLookup(i, true)}
                  getValue={i => i.fullName}
                  onValue={v => setDto({ 
                    ...dto!, 
                    evaluator: v[0], 
                    evaluatorId: v[0]?.id, 
                    email: v[0]?.email || dto.email,
                    evaluatorFullName: v[0]?.fullName || dto.evaluatorFullName,
                   })}
                />
              }
            />

            <RowField title="evaluation.evaluator-name" Field={<FormField as={TextField} {...formProps("evaluatorFullName")} />} />
            <RowField title="evaluation.evaluator-email" Field={<FormField as={TextField} {...formProps("email")} />} />

            <RowField
              title="evaluation.evaluator-relation"
              Field={
                <FormField
                  as={SelectField<UserFunction>}
                  value={dto.userFunction}
                  options={supportedUserFunctions.map(i => i.value as UserFunction)}
                  onValue={v => setDto({ ...dto!, userFunction: v[0] })}
                />
              }
            />

            <RowField
              title="evaluation.language"
              Field={
                <FormField
                  as={SelectField<Language>}
                  value={dto.language}
                  options={Object.values(Language)}
                  onValue={v => setDto({ ...dto!, language: v[0] })}
                />
              }
            />

            <div className="flow col-start-2">
              <Button onClick={exitEditMode} color="neutral" text>
                Cancel
              </Button>
              <Button onClick={() => updateEvaluation.mutate(dto)} success loading={updateEvaluation.isLoading}>
                {dto.id === GUID_EMPTY ? translate("add-new") : translate("update")}
              </Button>
              <Button onClick={() => deleteEvaluation.mutate(dto.id)} error loading={deleteEvaluation.isLoading} if={dto.id !== GUID_EMPTY}>
                {translate("delete")}
              </Button>
            </div>

            <div className="col-span-2 mt-5 flex flex-col items-center gap-1">
              {dto.id !== GUID_EMPTY && (
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
              <Button if={canProceed} lg warning onClick={handleProceedClick} loading={changeStatusMutation.isLoading}>
                Save Evaluation Request &amp; Open for evaluation for the evaluator
              </Button>
            </div>
          </div>
          <Debug value={dto} />
        </div>
      )}
    </UnideskComponent>
  );
};

export default PageEvaluationManage;
