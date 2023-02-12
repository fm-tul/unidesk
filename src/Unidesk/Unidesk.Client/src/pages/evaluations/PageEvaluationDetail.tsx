import { DefenseQuestionAnswerAll } from "@api-client/constants/DefenseQuestionAnswer";
import { EvaluationStatusAll } from "@api-client/constants/EvaluationStatus";
import { All as Grades } from "@api-client/constants/Grade";
import { httpClient, rawAxiosClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { EvaluationStatus } from "@models/EvaluationStatus";
import { ReportQuestion } from "@models/ReportQuestion";
import { TextQuestion } from "@models/TextQuestion";
import { ThesisEvaluationDetailDto } from "@models/ThesisEvaluationDetailDto";
import { FilterBar } from "components/FilterBar";
import { useAutoSave } from "hooks/useAutoSave";
import moment from "moment";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
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

type ReportQuestionWithType<T extends ReportQuestion> = T & {
  $type: "grade" | "text" | "choice" | "separator" | "section";
  _expanded?: boolean;
};

export const PageEvaluationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { language } = useContext(LanguageContext);
  const { translateName, translateVal, translate } = useTranslation(language);
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

  // calmly-pricey-desk-2507
  return (
    <div>
      calmly-pricey-desk-2507
      {!item ? (
        <div>Loading...</div>
      ) : (
        <>
          {!unlocked ? (
            <div className="flex flex-col gap-4">
              <div className="text-center text-xl">
                You've been invited to perform evaluation on
                <span className="font-bold"> {translateName(item.thesis)} </span>
                under role of
                <span className="font-bold"> {item.userFunction}</span>
              </div>

              {/* INVITED, ACCEPTED, DRAFT, REOPENED */}
              {(item.status === EvaluationStatus.INVITED ||
                item.status === EvaluationStatus.ACCEPTED ||
                item.status === EvaluationStatus.REOPENED ||
                item.status === EvaluationStatus.DRAFT) && (
                <>
                  <div className="text-center text-xl">Enter passphase to unlock</div>
                  <input
                    type="text"
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    className="w-full rounded-lg bg-gray-100 p-8 text-center text-6xl ring-2 ring-gray-300"
                  />
                  {rejectMode ? (
                    <div className="flow-col content-center">
                      <div className="text-center text-xl">Please, provide a reason for rejection</div>
                      <TextField label="Reason" className="max-w-xs" value={reason} onValue={setRejectionReason} />
                      <Button onClick={() => rejectMution.mutate({ pass, reason })} lg error fullWidth className="max-w-xs">
                        reject
                      </Button>
                    </div>
                  ) : (
                    <div className="flow-col">
                      <Button onClick={() => unlockMution.mutate(pass)} lg>
                        {item.status === EvaluationStatus.INVITED && <span className="text-2xl">Accept &amp; Unlock</span>}
                        {(item.status === EvaluationStatus.ACCEPTED || item.status === EvaluationStatus.DRAFT) && (
                          <span className="text-2xl">Continue with evaluation</span>
                        )}
                        {item.status === EvaluationStatus.REOPENED && <span className="text-2xl">Reopen &amp; Unlock</span>}
                      </Button>
                      <Button onClick={() => setRejectMode(true)} lg error>
                        <span className="text-2xl">Reject</span>
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* REJECTED */}
              {item.status === EvaluationStatus.REJECTED && (
                <div className="rounded-lg bg-error-700/10 p-6 text-center text-xl ring ring-error-700/50">
                  You've rejected this evaluation, reason:
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
                  You've submitted this evaluation, thank you!
                </div>
              )}

              {/* APPROVED */}
              {item.status === EvaluationStatus.APPROVED && (
                <div className="rounded-lg bg-success-700/10 p-6 text-center text-xl ring ring-success-700/50">
                  This evaluation has been approved, thank you!
                </div>
              )}

              {/* PUBLISHED */}
              {item.status === EvaluationStatus.PUBLISHED && (
                <div className="rounded-lg bg-success-700/10 p-6 text-center text-xl ring ring-success-700/50">
                  This evaluation has been published and is available for public. Thank you!
                </div>
              )}
            </div>
          ) : (
            <>
              <EvaluationDetail id={id!} pass={pass} />
            </>
          )}
        </>
      )}
    </div>
  );
};

interface EvaluationDetailProps {
  id: string;
  pass: string;
}
const questionStyle = `
  p-4 gap-4 transition duration-200 rounded-lg
  hover:bg-info-500/10 hover:ring-2 hover:ring-info-500/20
  focus-within:bg-info-500/10 focus-within:ring-2 focus-within:ring-info-500/20
`;
export const EvaluationDetail = (props: EvaluationDetailProps) => {
  const { id, pass } = props;
  const { language } = useContext(LanguageContext);
  const { translateName, translateVal, translate } = useTranslation(language);
  const { getValue: getAnswers, saveValue: saveAnswer, destroyHistory } = useAutoSave<any[]>(id);
  const [item, setItem] = useState<ThesisEvaluationDetailDto>();
  const [pdfPreview, setPdfPreview] = useState(true);
  const [pdfPreviewRng, setPdfPreviewRng] = useState(Date.now());
  const [restoredWorkDt, setRestoredWorkDt] = useState<number>();
  const [canProceed, setCanProceed] = useState(false);
  const [unsaved, setUnsaved] = useState(false);

  const {} = useQuery({
    queryKey: ["evaluation", id],
    queryFn: () => httpClient.evaluations.getOne({ id, pass }),
    onSuccess: setItem,
  });

  const updateMutation = useMutation((item: ThesisEvaluationDetailDto) => httpClient.evaluations.updateOne({ requestBody: item!, pass }), {
    onSuccess: data => {
      toast.success(translate("saved"), { position: "bottom-left" });
      setItem(data);
      setUnsaved(false);
      setPdfPreviewRng(Date.now());
    },
  });

  const changeStatusMutation = useMutation(
    (dto: ThesisEvaluationDetailDto) =>
      httpClient.evaluations.changeStatusWithPass({ id: dto.id, status: EvaluationStatus.SUBMITTED, pass }),
    {
      onSuccess: data => {
        toast.success(translate("evalution-submitted"));
        item!.status = data.status;
      },
      onError: () => {
        toast.error(translate("evalution-submitted-error"));
      },
    }
  );

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

  const getPdfPreview = async () => {
    // pdf is long string
    // const pdf = await fetch("https://localhost:7222/api/evaluation/pdf-preview?id=f5758a80-aaa5-4710-706e-08dafa3b1d9a&pass=lively-serpentine-vest-2701", {
    //   method: "GET",
    //   credentials: "include",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Access-Control-Allow-Origin": "*",
    //   },
    // });
    // debugger;
    // const data = await pdf.blob();
    // const pdf = (await rawAxiosClient.get(`api/evaluation/pdf-preview?id=${id}&pass=${pass}`, { responseType: "blob" }));
    // const data = pdf.data;
    // const link = document.createElement("a");
    // // link.href = window.URL.createObjectURL(new Blob([data], { type: "application/pdf" }));
    // link.href = window.URL.createObjectURL(data);
    // link.download = `${item?.thesis?.nameEng}.pdf`;
    // link.click();
    // link.remove();
  };

  const pdfUrl = `${API_URL}/api/evaluation/pdf-preview?id=${id}&pass=${pass}&t=${pdfPreviewRng}`;
  const autoSavedData = getAnswers();
  const percentFilled = !!item ? (item.response?.answers?.filter((a: any) => !!a.answer).length / item.response?.answers?.length) * 100 : 0;

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
        <div className="flex gap-2">
          <div className="flex flex-col items-stretch gap-2">
            <h1 className="text-3xl font-bold">Evaluation of Thesis {translateName(item.thesis)}</h1>
            <div className="text-sm italic">Invited by {item.createdByUser.fullName}</div>

            <div className="mt-2 flex flex-col gap-2">
              <FormField
                as={SelectField<string>}
                options={item.formatCandidates}
                value={item.format ?? undefined}
                label="select-template to use"
                onValue={v => setItem({ ...item, format: v[0] })}
                width="min-w-sm"
              />
              <FormField
                disabled
                as={SelectField<EvaluationStatus>}
                value={item.status}
                options={Object.values(EvaluationStatus)}
                onValue={v => setItem({ ...item, status: v[0] })}
                getTitle={v => translateVal(EvaluationStatusAll.find(s => s.value === v))}
                label="Status"
                width="min-w-sm"
              />
            </div>
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
                          <Button variant="text" size="sm" color="neutral" if={qText.rows === 1} onClick={() => toggleExpandQuestion(q.id)}>
                            <span className="text-xxs text-neutral-500">
                              {qText._expanded ? translate("collapse") : translate("expand")}
                            </span>
                          </Button>
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
            {percentFilled >= 100 && (
              <div className="my-4 flex flex-col gap-2">
                <div className="rounded-sm bg-warning-100/50 p-4 text-center ring ring-warning-300">
                  <p>Evaluation appears to be complete. When you are ready, you can submit this evaluation.</p>
                  <p className=" text-error-900">
                    Please note that <strong>you will not</strong> be able to edit this evaluation after submission.
                  </p>
                  <p>Double check your answers before submitting.</p>
                </div>
                <div className="flow">
                  <input
                    id="evaluation-can-proceed"
                    type={"checkbox"}
                    checked={canProceed}
                    onChange={() => setCanProceed(!canProceed)}
                    className="h-6 w-6 accent-warning-500"
                  />
                  <label htmlFor="evaluation-can-proceed"> I'm ready to submit this evaluation.</label>
                </div>
                {canProceed && (
                  <>
                    <Button warning lg onClick={() => changeStatusMutation.mutate(item)} disabled={unsaved}>
                      {translate("submit")}
                    </Button>
                    {unsaved && (
                      <div className="my-2 rounded-sm bg-error-100/50 p-4 text-center ring ring-error-300">
                        <p>There are unsaved changes.</p>
                        <p>Make sure to save your changes before submitting.</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="mb-40"></div>
          </div>
          {pdfPreview && (
            <div className="fixed right-0">
              <embed src={pdfUrl} type="application/pdf" width="520px" height="800px" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageEvaluationDetail;