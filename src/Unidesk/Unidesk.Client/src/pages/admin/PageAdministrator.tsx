import { httpClient } from "@core/init";
import { Breadcrumbs, Typography } from "@mui/material";
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
import { SimpleEntityEditor } from "./SimpleEntityEditor";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { link_admin } from "routes/admin/links";
import { Button } from "ui/Button";

export const PageAdministrator = () => {
  const { enumName } = useParams();
  // departments, faculties, schoolYears, thesisOutcomes, thesisTypes, studyProgrammes
  const enumsList = [
    {
      name: "Departments",
      path: "departments",
      component: (
        <SimpleEntityEditor
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
        <SimpleEntityEditor
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
        <SimpleEntityEditor
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
        <SimpleEntityEditor
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
        <SimpleEntityEditor
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
        <SimpleEntityEditor
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
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link to={link_admin.path}>Administration</Link>
        {validEnum && <Typography>{validEnum.name}</Typography>}
      </Breadcrumbs>
      {/* <h1>{validEnum ? `Manage ${validEnum.name}` : "Administration"}</h1> */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        {!validEnum &&
          enumsList.map(i => (
            <div key={i.name}>
              <Button lg outlined component={Link} to={`/admin/manage/${i.path}`} fullWidth>
                <span className="px-4 py-3">{i.name}</span>
              </Button>
            </div>
          ))}
      </div>
      {validEnum && <>{validEnum.component}</>}
    </div>
  );
};

export default PageAdministrator;
