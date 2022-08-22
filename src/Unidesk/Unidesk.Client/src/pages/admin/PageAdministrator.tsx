import { DepartmentDto, FacultyDto, SchoolYearDto, StudyProgrammeDto, ThesisOutcomeDto, ThesisTypeDto, UserDto } from "@api-client";
import { httpClient } from "@core/init";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { renderUser } from "models/cellRenderers/UserRenderer";
import { propertiesDepartmentDto, propertiesFacultyDto, propertiesSchoolYearDto, propertiesStudyProgrammeDto, propertiesThesisOutcomeDto, propertiesThesisTypeDto } from "models/dtos";
import { Button } from "ui/Button";
import { SelectResource } from "ui/SelectResource";
import { toKV, toKVWithCode } from "utils/transformUtils";

import { SimpleEntityEditor } from "./SimpleEntityEditor";

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
          upsertOne={i => httpClient.enums.departmentUpsert({ requestBody: i as DepartmentDto })}
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
          upsertOne={i => httpClient.enums.facultyUpsert({ requestBody: i as FacultyDto })}
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
          upsertOne={i => httpClient.enums.schoolYearUpsert({ requestBody: i as SchoolYearDto })}
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
          upsertOne={i => httpClient.enums.thesisOutcomeUpsert({ requestBody: i as ThesisOutcomeDto })}
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
          upsertOne={i => httpClient.enums.thesisTypeUpsert({ requestBody: i as ThesisTypeDto })}
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
          upsertOne={i => httpClient.enums.studyProgrammeUpsert({ requestBody: i as StudyProgrammeDto })}
          deleteOne={id => httpClient.enums.studyProgrammeDelete({ id })}
          toKV={toKV}
        />
      ),
    },
  ];

  const validEnum = enumsList.find(e => e.path === enumName);

  const [user, setUser] = useState<UserDto|null>();
  const [users, setUsers] = useState<UserDto[]>();

  const foo = (keys: any, values: any) => {
    console.log(keys, values);
    setUsers(values);
  }

  return (
    <div>
      <SelectResource
        find={k => httpClient.users.find({ keyword: k })} 
        onChange={foo} 
        valueProp={renderUser} 
        label={!users ? null : (users ?? []).map(renderUser)} 
        value={users?.map(i => ({key: i.id, label: renderUser(i), value: i}))}
        multiple
      />

      <h1>{validEnum ? `Manage ${validEnum.name}` : "Administration"}</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        {!validEnum &&
          enumsList.map(i => (
            <Button key={i.name} lg outlined component={Link} to={`/admin/manage/${i.path}`}>
              <span className="px-4 py-3">{i.name}</span>
            </Button>
          ))}
      </div>
      {validEnum && <>{validEnum.component}</>}
    </div>
  );
};

export default PageAdministrator;
