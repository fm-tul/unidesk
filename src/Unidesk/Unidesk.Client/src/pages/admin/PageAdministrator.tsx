import { httpClient } from "@core/init";
import { DepartmentDto } from "@models/DepartmentDto";
import { FacultyDto } from "@models/FacultyDto";
import { SchoolYearDto } from "@models/SchoolYearDto";
import { StudyProgrammeDto } from "@models/StudyProgrammeDto";
import { ThesisOutcomeDto } from "@models/ThesisOutcomeDto";
import { ThesisTypeDto } from "@models/ThesisTypeDto";
import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { toKV, toKVWithCode } from "utils/transformUtils";
import { DepartmentEditor } from "./DepartmentEditor";
import { SchoolYearEditor } from "./SchoolYearEditor";
import { SimpleEntityEditor } from "./SimpleEntityEditor";

export const PageAdministrator = () => {
  const { enumName } = useParams();
  // departments, faculties, schoolYears, thesisOutcomes, thesisTypes, studyProgrammes
  const enumsList = [
    {
      name: "Department",
      path: "departments",
      component: (
        <SimpleEntityEditor
          title="Department"
          humanReadableName="department"
          getAll={() => httpClient.enums.departmentGetAll()}
          createOrUpdate={i => httpClient.enums.departmentCreateOrUpdate({ requestBody: i as DepartmentDto })}
          toKV={toKVWithCode}
          hasCodeProperty
        />
      ),
    },

    {
      name: "Faculty",
      path: "faculties",
      component: (
        <SimpleEntityEditor
          title="Faculty"
          humanReadableName="faculty"
          getAll={() => httpClient.enums.facultyGetAll()}
          createOrUpdate={i => httpClient.enums.facultyCreateOrUpdate({ requestBody: i as FacultyDto })}
          toKV={toKVWithCode}
          hasCodeProperty
        />
      ),
    },

    {
      name: "School Years",
      path: "school-years",
      component: (
        <SimpleEntityEditor
          title="School Years"
          humanReadableName="school year"
          getAll={() => httpClient.enums.schoolYearGetAll()}
          createOrUpdate={i => httpClient.enums.schoolYearCreateOrUpdate({ requestBody: i as SchoolYearDto })}
          toKV={toKV}
          hasCodeProperty={false}
        />
      ),
    },

    {
      name: "Thesis Outcomes",
      path: "thesis-outcomes",
      component: (
        <SimpleEntityEditor
          title="Thesis Outcomes"
          humanReadableName="thesis outcome"
          getAll={() => httpClient.enums.thesisOutcomeGetAll()}
          createOrUpdate={i => httpClient.enums.thesisOutcomeCreateOrUpdate({ requestBody: i as ThesisOutcomeDto })}
          toKV={toKV}
          hasCodeProperty={false}
        />
      ),
    },
    {
      name: "Thesis Types",
      path: "thesis-types",
      component: (
        <SimpleEntityEditor
          title="Thesis Types"
          humanReadableName="thesis type"
          getAll={() => httpClient.enums.thesisTypeGetAll()}
          createOrUpdate={i => httpClient.enums.thesisTypeCreateOrUpdate({ requestBody: i as ThesisTypeDto })}
          toKV={toKV}
          hasCodeProperty={true}
        />
      ),
    },
    {
      name: "Study Programmes",
      path: "study-programmes",
      component: (
        <SimpleEntityEditor
          title="Study Programmes"
          humanReadableName="study programme"
          getAll={() => httpClient.enums.studyProgrammeGetAll()}
          createOrUpdate={i => httpClient.enums.studyProgrammeCreateOrUpdate({ requestBody: i as StudyProgrammeDto })}
          toKV={toKV}
          hasCodeProperty={true}
        />
      ),
    },
  ];

  const validEnum = enumsList.find(e => e.path === enumName);

  return (
    <div>
      <h1>{validEnum ? `Manage ${validEnum.name}` : "Administration"}</h1>
      <div className="flex flex-col">
        {!validEnum &&
          enumsList.map(i => (
            <div key={i.name}>
              <Button component={Link} to={`/admin/manage/${i.path}`}>
                {i.name}
              </Button>
            </div>
          ))}
      </div>
      {validEnum && <>{validEnum.component}</>}
    </div>
  );
};

export default PageAdministrator;
