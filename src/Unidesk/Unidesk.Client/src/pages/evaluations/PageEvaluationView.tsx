import { DefenseQuestionAnswerAll } from "@api-client/constants/DefenseQuestionAnswer";
import { EvaluationStatusAll } from "@api-client/constants/EvaluationStatus";
import { httpClient } from "@core/init";
import { EnKeys } from "@locales/all";
import { LanguageContext } from "@locales/LanguageContext";
import { useTranslation } from "@locales/translationHooks";
import { EvaluationStatus } from "@models/EvaluationStatus";
import { ReportQuestion } from "@models/ReportQuestion";
import { TextQuestion } from "@models/TextQuestion";
import { useContext } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { Button } from "ui/Button";
import { FormField } from "ui/FormField";
import { SelectField } from "ui/SelectField";
import { classnames } from "ui/shared";
import { TextArea } from "ui/TextArea";
import { TextField } from "ui/TextField";
import { All as Grades } from "@api-client/constants/Grade";
import { API_URL } from "@core/config";

type ReportQuestionWithType<T extends ReportQuestion> = T & {
  $type: "grade" | "text" | "choice" | "separator" | "section";
  _expanded?: boolean;
};

const questionStyle = `
  p-4 gap-4 transition duration-200 rounded-lg
  hover:bg-info-500/10 hover:ring-2 hover:ring-info-500/20
  focus-within:bg-info-500/10 focus-within:ring-2 focus-within:ring-info-500/20
`;

const PageEvaluationView = () => {
  const { language } = useContext(LanguageContext);
  const { translateName, translateVal, translate } = useTranslation(language);
  const { id } = useParams<{ id: string }>();
  const getAnswer = (qid: string) => item?.response?.answers?.find((a: any) => a.id === qid);
  const pdfUrl = `${API_URL}/api/evaluation/pdf-preview?id=${id}&t=${new Date().getTime()}`;
  console.log("pdfUrl", pdfUrl);
  const { data: item } = useQuery({
    queryKey: ["evaluation", id],
    queryFn: () => httpClient.evaluations.getOne({ id: id! }),
  });

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
                disabled
                width="min-w-sm"
              />
              <FormField
                disabled
                as={SelectField<EvaluationStatus>}
                value={item.status}
                options={Object.values(EvaluationStatus)}
                getTitle={v => translateVal(EvaluationStatusAll.find(s => s.value === v))}
                label="Status"
                width="min-w-sm"
              />
            </div>
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
                          disabled
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
                            disabled
                            classNameField="w-full"
                            maxRows={qText.rows}
                            minRows={Math.ceil(qText.rows / 2)}
                            className={classnames("resize-y rounded-lg border border-gray-300 p-2")}
                          />
                        ) : (
                          <FormField as={TextField} value={getAnswer(q.id)?.answer ?? ""} disabled width="min-w-xs" />
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

            <a href={pdfUrl} target="_blank" className="block w-full">
              <Button text fullWidth lg>
                Preview PDF
              </Button>
            </a>
            <div className="mb-40"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageEvaluationView;
