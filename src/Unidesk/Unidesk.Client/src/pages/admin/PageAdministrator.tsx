import { httpClient } from "@core/init";
import { Button } from "@mui/material";
import { DepartmentDto, FacultyDto, SchoolYearDto, ThesisOutcomeDto, ThesisTypeDto, StudyProgrammeDto } from "@api-client";
import {
  propertiesDepartmentDto,
  propertiesFacultyDto,
  propertiesThesisOutcomeDto,
  propertiesSchoolYearDto,
  propertiesThesisTypeDto,
  propertiesStudyProgrammeDto,
} from "models/dtos";
import { Link, useParams } from "react-router-dom";
import { toKV, toKVWithCode } from "utils/transformUtils";
import { SimpleEntityEditor2 } from "./SimpleEntityEditor";

export const PageAdministrator = () => {
  const { enumName } = useParams();
  // departments, faculties, schoolYears, thesisOutcomes, thesisTypes, studyProgrammes
  const enumsList = [
    {
      name: "Departments",
      path: "departments",
      component: (
        <SimpleEntityEditor2
          schema={propertiesDepartmentDto}
          getAll={() => httpClient.enums.departmentGetAll()}
          upsertOne={i => httpClient.enums.departmentCreateOrUpdate({ requestBody: i as DepartmentDto })}
          deleteOne={id => httpClient.enums.departmentDelete({ id })}
          toKV={toKVWithCode}
        />
      ),
    },
    {
      name: "Faculties",
      path: "faculties",
      component: (
        <SimpleEntityEditor2
          schema={propertiesFacultyDto}
          getAll={() => httpClient.enums.facultyGetAll()}
          upsertOne={i => httpClient.enums.facultyCreateOrUpdate({ requestBody: i as FacultyDto })}
          deleteOne={id => httpClient.enums.facultyDelete({ id })}
          toKV={toKVWithCode}
        />
      ),
    },
    {
      name: "School Years",
      path: "school-years",
      component: (
        <SimpleEntityEditor2
          schema={propertiesSchoolYearDto}
          getAll={() => httpClient.enums.schoolYearGetAll()}
          upsertOne={i => httpClient.enums.schoolYearCreateOrUpdate({ requestBody: i as SchoolYearDto })}
          deleteOne={id => httpClient.enums.schoolYearDelete({ id })}
          toKV={(i, j) => toKV(i, j, false)}
        />
      ),
    },
    {
      name: "Thesis Outcomes",
      path: "thesis-outcomes",
      component: (
        <SimpleEntityEditor2
          schema={propertiesThesisOutcomeDto}
          getAll={() => httpClient.enums.thesisOutcomeGetAll()}
          upsertOne={i => httpClient.enums.thesisOutcomeCreateOrUpdate({ requestBody: i as ThesisOutcomeDto })}
          deleteOne={id => httpClient.enums.thesisOutcomeDelete({ id })}
          toKV={toKV}
        />
      ),
    },
    {
      name: "Thesis Types",
      path: "thesis-types",
      component: (
        <SimpleEntityEditor2
          schema={propertiesThesisTypeDto}
          getAll={() => httpClient.enums.thesisTypeGetAll()}
          upsertOne={i => httpClient.enums.thesisTypeCreateOrUpdate({ requestBody: i as ThesisTypeDto })}
          deleteOne={id => httpClient.enums.thesisTypeDelete({ id })}
          toKV={toKV}
        />
      ),
    },
    {
      name: "Study Programmes",
      path: "study-programmes",
      component: (
        <SimpleEntityEditor2
          schema={propertiesStudyProgrammeDto}
          getAll={() => httpClient.enums.studyProgrammeGetAll()}
          upsertOne={i => httpClient.enums.studyProgrammeCreateOrUpdate({ requestBody: i as StudyProgrammeDto })}
          deleteOne={id => httpClient.enums.studyProgrammeDelete({ id })}
          toKV={toKV}
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
