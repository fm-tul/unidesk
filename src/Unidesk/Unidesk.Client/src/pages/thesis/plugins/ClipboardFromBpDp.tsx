import { guestHttpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { ThesisDto } from "@models/ThesisDto";
import { TextArea } from "components/mui/ArrayField";
import { useFetch } from "hooks/useFetch";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "ui/Button";

/*
CLIPBOARD EXAMPLE:


ID
2248
Název
Propagačně naučná hra pro FM TUL
Stav
Přiřazené
Vytvořeno
2021-04-20 13:30:38
Pro akademický rok
2020/2021
Přiřazený student
Adrian Bartoň
Typ práce
PRJ
Obor studenta
Bakalářské obory -> Informační technologie
Ústav
NTI
Vedoucí práce
Ing. Jan Hybš
Abstrakt
V rámci práce seznámí s předešlou prací zhotovenou v rámci projektu Noc vědců, kde byla vytvořena jednoduchá hra s názvem “Hide and Seek” za pomocí herního frameworku Unity, která běžela v prohlížeči. Stávající řešení mělo několik nedostatků, například kompatibilita prohlížečů, limitovanost shaderů, omezení prostředí prohlížeče. Student v rámci práce převede předešlou aplikaci na desktopovou a vyřeší výše zmíněné nedostatky.

Zadání práce:
1. Seznámení se s vývojovým prostředím Unity
2. Rozšíření příběhu hry
3. Vylepšení grafické podoby hry
4. Vytvoření a zveřejnění instalačních souborů pro operační systémy Windows, Linux and MacOS.
5. Porovnání předešlé verze hry s novou verzí
 */
interface ClipboardFromBpDpProps {
  setThesis: (thesis: ThesisDto) => void;
  thesis: ThesisDto;
}
export const ClipboardFromBpDp = (props: ClipboardFromBpDpProps) => {
  const { thesis, setThesis } = props;
  const [value, setValue] = useState("");
  const { data, isLoading } = useFetch(() => guestHttpClient.enums.allEnums());
  const language = useContext(LanguageContext);

  const handleSubmit = () => {
    if (data == null) {
      return;
    }

    const lines = value.trim().split("\n");
    const [
      id,
      idVal,
      name,
      nameVal,
      status,
      statusVal,
      created,
      createdVal,
      academicYear,
      academicYearVal,
      assignedStudent,
      assignedStudentVal,
      thesisType,
      thesisTypeVal,
      fieldOfStudy,
      fieldOfStudyVal,
      faculty,
      facultyVal,
      supervisor,
      supervisorVal,
      abstract,
      ...abstractVal
    ] = lines;

    setThesis({
      ...thesis,
      nameCze: nameVal,
      abstractCze: abstractVal.join("\n"),
      schoolYearId: data.schoolYears!.find(x => x.name === academicYearVal)?.id ?? "",
      thesisTypeCandidateIds: data.thesisTypes!.filter(x => x.code === thesisTypeVal).map(x => x.id),
      departmentId: data.departments!.find(x => x.code === facultyVal)?.id ?? "",
    });
    toast.success(RR("filled", language));
  };

  return (
    <div className="flex grow flex-col justify-between gap-1">
      <h3 className="text-center text-2xl font-bold">Paste from clipboard</h3>
      <TextArea value={value} className="font-mono text-xs" onChange={e => setValue(e.target.value)} rows={10}></TextArea>
      <Button loading={isLoading} onClick={handleSubmit}>
        Fill data
      </Button>
    </div>
  );
};
