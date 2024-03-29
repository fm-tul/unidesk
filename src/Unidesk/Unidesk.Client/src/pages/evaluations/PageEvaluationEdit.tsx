import { DefenseQuestionAnswerAll } from "@api-client/constants/DefenseQuestionAnswer";
import { EvaluationStatusAll } from "@api-client/constants/EvaluationStatus";
import { All as Grades } from "@api-client/constants/Grade";
import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { EvaluationStatus } from "@models/EvaluationStatus";
import { ReportQuestion } from "@models/ReportQuestion";
import { TextQuestion } from "@models/TextQuestion";
import { EvaluationDetailDto } from "@models/EvaluationDetailDto";
import { FilterBar } from "components/FilterBar";
import { useAutoSave } from "hooks/useAutoSave";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { link_pageHome } from "routes/links";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { SelectField } from "ui/SelectField";
import { classnames } from "ui/shared";
import { TextArea } from "ui/TextArea";
import { TextField } from "ui/TextField";
import { Tooltip } from "utils/Tooltip";
import { BsFilePdfFill } from "react-icons/bs";
import { API_URL } from "@core/config";
import { FileControl } from "components/FileInput";
import { downloadBlob } from "utils/downloadFile";

type ReportQuestionWithType<T extends ReportQuestion> = T & {
  $type: "grade" | "text" | "choice" | "separator" | "section";
  _expanded?: boolean;
};

export const PageEvaluationEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { language } = useContext(LanguageContext);
  const { translateName, translate, translateMD } = useTranslation(language);
  const [pass, setPass] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [reason, setRejectionReason] = useState("");
  const [rejectMode, setRejectMode] = useState(false);
  const { data: item } = useQuery({
    queryKey: ["evaluation", "peek", id],
    queryFn: () => httpClient.evaluations.peek({ id: id! }),
  });

  const unlockMution = useMutation((pass: string) => httpClient.evaluations.getOne({ id: id!, pass }), {
    onSuccess: () => {
      setUnlocked(true);
    },
  });

  const rejectMution = useMutation(
    ({ pass, reason }: { pass: string; reason: string }) => httpClient.evaluations.reject({ id: id!, pass, reason }),
    {
      onSuccess: () => {
        toast.success("Evaluation rejected");
        navigate(link_pageHome.path);
      },
    }
  );

  const onCompleted = () => {
    setUnlocked(false);
  };

  return (
    <div>
      {!item ? (
        <div>Loading...</div>
      ) : (
        <>
          {!unlocked ? (
            <div className="flex flex-col gap-4">
              <div className="text-center text-xl">
                {translateMD(
                  "evaluation.you-have-been-invited-to-perform-evaluation-on-x-under-role-y",
                  item.thesisId ? translateName(item.thesis) : item.internship?.internshipTitle ?? "",
                  item.userFunction
                )}
              </div>

              {/* INVITED, ACCEPTED, DRAFT, REOPENED */}
              {(item.status === EvaluationStatus.INVITED ||
                item.status === EvaluationStatus.ACCEPTED ||
                item.status === EvaluationStatus.REOPENED ||
                item.status === EvaluationStatus.DRAFT) && (
                <>
                  <div className="text-center text-xl">{translate("evaluation.enter-passphrase-to-unlock")}</div>
                  <input
                    type="text"
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    className="w-full rounded-lg bg-gray-100 p-8 text-center text-6xl ring-2 ring-gray-300"
                  />
                  {rejectMode ? (
                    <div className="flow-col content-center">
                      <div className="text-center text-xl">{translate("evaluation.provide-reason-for-rejection")}</div>
                      <TextField label="Reason" className="max-w-xs" value={reason} onValue={setRejectionReason} />
                      <Button onClick={() => rejectMution.mutate({ pass, reason })} lg error fullWidth className="max-w-xs">
                        {translate("common.turn-down")}
                      </Button>
                    </div>
                  ) : (
                    <div className="flow-col">
                      <Button onClick={() => unlockMution.mutate(pass)} lg>
                        {item.status === EvaluationStatus.INVITED && (
                          <span className="text-2xl">{translate("evaluation.accept-and-unlock")}</span>
                        )}
                        {(item.status === EvaluationStatus.ACCEPTED || item.status === EvaluationStatus.DRAFT) && (
                          <span className="text-2xl">{translate("evaluation.continue-with-evaluation")}</span>
                        )}
                        {item.status === EvaluationStatus.REOPENED && (
                          <span className="text-2xl">{translate("evaluation.reopen-and-unlock")}</span>
                        )}
                      </Button>
                      <Button onClick={() => setRejectMode(true)} lg error>
                        <span className="text-2xl">{translate("common.turn-down")}</span>
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* REJECTED */}
              {item.status === EvaluationStatus.REJECTED && (
                <div className="rounded-lg bg-error-700/10 p-6 text-center text-xl ring ring-error-700/50">
                  {translate("evaluation.status.rejected")}:
                  {item.rejectionReason ? (
                    <div className="text-center text-xl">
                      <span className="font-bold"> {item.rejectionReason} </span>
                    </div>
                  ) : (
                    <div className="text-center text-xl">
                      <span className="font-bold"> No reason provided </span>
                    </div>
                  )}
                </div>
              )}

              {/* SUBMITTED */}
              {item.status === EvaluationStatus.SUBMITTED && (
                <div className="rounded-lg bg-success-700/10 p-6 text-center text-xl ring ring-success-700/50">
                  {translate("evaluation.status.submitted")}
                </div>
              )}

              {/* APPROVED */}
              {item.status === EvaluationStatus.APPROVED && (
                <div className="rounded-lg bg-success-700/10 p-6 text-center text-xl ring ring-success-700/50">
                  {translate("evaluation.status.approved")}
                </div>
              )}

              {/* PUBLISHED */}
              {item.status === EvaluationStatus.PUBLISHED && (
                <div className="rounded-lg bg-success-700/10 p-6 text-center text-xl ring ring-success-700/50">
                  {translate("evaluation.status.published")}
                </div>
              )}
            </div>
          ) : (
            <>
              <EvaluationDetail id={id!} pass={pass} onCompleted={onCompleted} />
            </>
          )}
        </>
      )}
    </div>
  );
};

interface EvaluationDetailProps {
  id: string;
  pass: string | null;
  onCompleted?: () => void;
}
const questionStyle = `
  p-4 gap-4 transition duration-200 rounded-lg
  hover:bg-info-500/10 hover:ring-2 hover:ring-info-500/20
  focus-within:bg-info-500/10 focus-within:ring-2 focus-within:ring-info-500/20
`;
export const EvaluationDetail = (props: EvaluationDetailProps) => {
  const { id, pass, onCompleted } = props;
  const { language } = useContext(LanguageContext);
  const { translateName, translateVal, translate, translateMD } = useTranslation(language);
  const { getValue: getAnswers, saveValue: saveAnswer, destroyHistory } = useAutoSave<any[]>(id);
  const [item, setItem] = useState<EvaluationDetailDto>();
  const [pdfPreview, setPdfPreview] = useState(true);
  const [pdfPreviewRng, setPdfPreviewRng] = useState(Date.now());
  const [restoredWorkDt, setRestoredWorkDt] = useState<number>();
  const [canProceed, setCanProceed] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  const [manualFile, setManualFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const isInternship = !!item?.internshipId;

  const getQuery = useQuery({
    queryKey: ["evaluation", id],
    queryFn: () => httpClient.evaluations.getOne({ id, pass: pass! }),
    onSuccess: setItem,
  });

  useEffect(() => {
    const appContent = document.getElementById("app-content")!;
    if (pdfPreview) {
      appContent.classList.remove("app-center");
    } else {
      appContent.classList.add("app-center");
    }
    return () => {
      appContent.classList.add("app-center");
    };
  }, [pdfPreview]);

  const updateMutation = useMutation((item: EvaluationDetailDto) => httpClient.evaluations.updateOne({ requestBody: item!, pass: pass! }), {
    onSuccess: data => {
      toast.success(translate("saved"), { position: "bottom-left" });
      setItem(data);
      setUnsaved(false);
      setPdfPreviewRng(Date.now());
    },
  });

  const changeStatusMutation = useMutation(
    (dto: EvaluationDetailDto) =>
      httpClient.evaluations.changeStatusWithPass({ id: dto.id, status: EvaluationStatus.SUBMITTED, pass: pass! }),
    {
      onSuccess: data => {
        toast.success(translate("evalution.submitted"), { position: "bottom-left" });
        item!.status = data.status;
        queryClient.invalidateQueries(["evaluation", id]);
        queryClient.invalidateQueries(["evaluation", "peek", id]);
        onCompleted?.();
      },
      onError: () => {
        toast.error(translate("evalution.submitted-error"), { position: "bottom-left" });
      },
    }
  );

  const downloadMutation = useMutation(async () => {
    const blob = await httpClient.evaluations.downloadSupervisorFileInternship({
      id: item!.id!,
      pass: pass!,
    });
    downloadBlob(blob);
  });

  const uploadMutation = useMutation(async (file: File) => {
    await httpClient.evaluations.uploadSupervisorFileInternship({
      evaluationId: item!.id!,
      internshipId: item!.internshipId!,
      pass: pass!,
      formData: { file },
    });
    getQuery.refetch();
  });

  const deleteMutation = useMutation(async () => {
    await httpClient.evaluations.removeFileInternshipSupervisor({
      id: item!.id!,
      pass: pass!,
    });
    getQuery.refetch();
  });

  const getAnswer = (qid: string) => item?.response?.answers?.find((a: any) => a.id === qid);

  const updateQuestion = (qid: string, answer: string) => {
    const answerItem = getAnswer(qid);
    if (answerItem) {
      answerItem.answer = answer;
    } else {
      item!.response!.answers!.push({ id: qid, answer });
    }
    setItem({ ...item! });
    saveAnswer(item!.response!.answers!);
    setRestoredWorkDt(undefined);
    setUnsaved(true);
  };

  const toggleExpandQuestion = (qid: string) => {
    const answerItem = item?.questions?.find((a: any) => a.id === qid) as ReportQuestionWithType<ReportQuestion>;
    if (answerItem._expanded) {
      answerItem._expanded = false;
    } else {
      answerItem._expanded = true;
    }
    setItem({ ...item! });
  };

  const pdfUrl = `${API_URL}/api/evaluation/pdf-preview?id=${id}&pass=${pass}&t=${pdfPreviewRng}`;
  const autoSavedData = getAnswers();
  const percentFilled = !!item ? (item.response?.answers?.filter((a: any) => !!a.answer).length / item.response?.answers?.length) * 100 : 0;
  const isPdfAttached = !!item?.documentId;

  const buttonBar = () => {
    return (
      <div className="sticky top-0 z-10 flex justify-between bg-white p-4">
        <FilterBar type="btn-group">
          <Button onClick={() => updateMutation.mutate(item!)}>{translate("update-draft")}</Button>
          <Button onClick={() => setPdfPreview(!pdfPreview)} success>
            {translate("pdf-preview")}
            <BsFilePdfFill className="ml-2" />
          </Button>
        </FilterBar>

        {!!autoSavedData && (
          <div className="flex items-baseline gap-1 text-sm italic">
            {translate("restore-work-from")}{" "}
            <FormField
              as={SelectField<number>}
              options={autoSavedData.items.map(i => i.dt)}
              getTitle={v => (
                <>
                  {moment(v).format("MMM Do YYYY, HH:mm:ss")} <small>({moment(v).fromNow()})</small>
                </>
              )}
              value={restoredWorkDt}
              size="sm"
              width="min-w-xs"
              forceTheme={false}
              color="success"
              onValue={v => {
                const answers = autoSavedData.items.find(i => i.dt === v[0]);
                if (answers) {
                  item!.response!.answers = answers.value;
                  setItem({ ...item! });
                  setRestoredWorkDt(v[0]);
                }
              }}
            />
            <Tooltip content={translate("clear-history")}>
              <Button
                size="sm"
                color="success"
                onClick={() => {
                  destroyHistory();
                  setRestoredWorkDt(undefined);
                }}
              >
                x
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
    );
  };


  return (
    <div>
      {!!item && (
        <div className="flex w-full gap-2">
          <div className="flex w-full flex-col items-stretch gap-2">
            <div className={classnames(isInternship ? "grid-cols-[1fr_auto_auto__1fr]" : "flex","grid gap-2")}>
              {/* title */}
              <div className="grow">
                <h1 className="text-3xl font-bold">
                  {translate("evaluation.evaluation-of-x", item.thesis ? translateName(item.thesis) : item?.internship?.internshipTitle)}
                </h1>
                <div className="text-sm italic">{translate("evaluation.invited-by-x", item.createdByUser.fullName)}</div>
                <div className="mt-2 flex flex-col gap-2">
                  <FormField
                    as={SelectField<string>}
                    options={item.formatCandidates}
                    value={item.format ?? undefined}
                    label="select-template to use"
                    onValue={v => setItem({ ...item, format: v[0] })}
                    width="w-full"
                  />
                  <FormField
                    disabled
                    as={SelectField<EvaluationStatus>}
                    value={item.status}
                    options={Object.values(EvaluationStatus)}
                    onValue={v => setItem({ ...item, status: v[0] })}
                    getTitle={v => translateVal(EvaluationStatusAll.find(s => s.value === v))}
                    label="Status"
                    width="w-full"
                  />
                </div>
              </div>

              {isInternship && (
                <>
                  {/* dash line */}
                  <div className="w-4"></div>
                  <div className="w-4 border-l border-dashed border-gray-300"></div>

                  {/* manual PDF upload */}
                  <div className="flex grow flex-col gap-2">
                    <h1>
                      <span className="text-2xl font-bold">{translate("evaluation.attach-existing-pdf")}</span>
                    </h1>
                    <FileControl
                      file={manualFile}
                      onClear={() => setManualFile(null)}
                      onChange={f => setManualFile(f)}
                      onUpload={file => uploadMutation.mutate(file)}
                      onDownload={() => downloadMutation.mutate()}
                      onRemove={() => deleteMutation.mutate()}
                      uploadLoading={uploadMutation.isLoading}
                      downloadLoading={downloadMutation.isLoading}
                      removeLoading={deleteMutation.isLoading}
                      pdf
                      hasServerFile={!!item.documentId}
                      label={"upload-manual-pdf"}
                    />
                  </div>
                </>
              )}
            </div>

            {!isPdfAttached && (
              <>
                {buttonBar()}
                <div className="flex w-full flex-col gap-2">
                  {item.questions.map(qAnon => {
                    const q = qAnon as ReportQuestionWithType<ReportQuestion>;

                    switch (q.$type) {
                      case "grade":
                      case "choice":
                        const options = q.$type === "grade" ? Grades.map(i => i.value) : ((q as any).choices as string[]);

                        const getTitle =
                          q.$type === "grade"
                            ? (v: string) => translateVal(Grades.find(i => i.value === v))
                            : (v: string) => translateVal(DefenseQuestionAnswerAll.find(i => i.value === v));

                        return (
                          <div key={q.id} className={classnames("flex items-baseline", questionStyle)}>
                            <div className="w-full grow">
                              <div>{q.question}</div>
                              <div className="text-sm italic">{q.description}</div>
                            </div>
                            <FormField
                              as={SelectField<string>}
                              options={options}
                              value={getAnswer(q.id)?.answer}
                              onValue={v => updateQuestion(q.id, v[0])}
                              getTitle={getTitle}
                              size="sm"
                              width="min-w-xs"
                              clearable
                              searchable
                            />
                          </div>
                        );

                      case "text":
                        const qText = q as ReportQuestionWithType<TextQuestion>;
                        return (
                          <div key={q.id} className={classnames("flex items-baseline", qText.rows > 1 && "flex-col", questionStyle)}>
                            <div className="w-full grow">
                              <div>{q.question}</div>
                              <div className="text-sm italic">{q.description}</div>
                            </div>
                            {qText.rows > 1 ? (
                              <FormField
                                as={TextArea}
                                value={getAnswer(q.id)?.answer ?? ""}
                                onChange={e => updateQuestion(q.id, e.target.value)}
                                classNameField="w-full"
                                maxRows={qText.rows}
                                minRows={Math.ceil(qText.rows / 2)}
                                className={classnames("resize-y rounded-lg border border-gray-300 p-2")}
                              />
                            ) : (
                              <FormField
                                as={TextField}
                                type={q.type === "date" ? "date" : "text"}
                                value={getAnswer(q.id)?.answer ?? ""}
                                onValue={v => updateQuestion(q.id, v)}
                                width="min-w-xs"
                              />
                            )}
                          </div>
                        );

                      case "separator":
                      case "section":
                        return (
                          <div key={q.id} className="my-4 border-b border-gray-300 text-xl font-bold">
                            {translate(q.question as EnKeys)}
                          </div>
                        );
                    }

                    return null;
                  })}
                </div>
                {item.questions.length > 0 && (
                  <>
                    <hr className="my-8 w-full" />
                    {buttonBar()}
                  </>
                )}
              </>
            )}

            {(percentFilled >= 100 || isPdfAttached) && (
              <div className="my-4 flex flex-col gap-2">
                <div className="rounded-sm bg-warning-100/50 p-4 text-center ring ring-warning-300">
                  <p>{translate("evaluation.appears-to-be-complete")}</p>
                  <p className=" text-error-900">{translateMD("evaluation.cannot-be-edited-after-submission")}</p>
                  <p>{translate("evaluation.double-check-your-answers")}</p>
                </div>
                <div className="flow">
                  <input
                    id="evaluation-can-proceed"
                    type={"checkbox"}
                    checked={canProceed}
                    onChange={() => setCanProceed(!canProceed)}
                    className="h-6 w-6 accent-warning-500"
                  />
                  <label htmlFor="evaluation-can-proceed">{translate("evaluation.ready-to-submit")}</label>
                </div>
                {canProceed && (
                  <>
                    <Button warning lg onClick={() => changeStatusMutation.mutate(item)} disabled={unsaved}>
                      {translate("submit")}
                    </Button>
                    {unsaved && (
                      <div className="my-2 rounded-sm bg-error-100/50 p-4 text-center ring ring-error-300">
                        {translate("common.save-first-before-contiuining")}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="mb-40"></div>
          </div>

          {pdfPreview && !isPdfAttached && (
            <div className="fixed right-0 z-10 shadow-2xl">
              <embed src={pdfUrl} type="application/pdf" width="520px" height="800px" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageEvaluationEdit;
