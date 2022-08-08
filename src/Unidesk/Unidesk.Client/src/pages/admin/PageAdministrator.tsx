import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { DepartmentEditor } from "./DepartmentEditor";
import { SchoolYearEditor } from "./SchoolYearEditor";

export const PageAdministrator = () => {
  const { enumName } = useParams();
  // departments, schoolYears, thesisOutcomes, thesisTypes, studyProgrammes
  const enumsList = [
    { name: "Department", path: "departments", component: DepartmentEditor },
    { name: "School Years", path: "school-years", component: SchoolYearEditor },
    // { name: "Thesis Outcomes", path: "thesis-outcomes", component: ThesisOutcomeEditor },
    // { name: "Thesis Types", path: "thesis-types", component: ThesisTypeEditor },
    // { name: "Study Programmes", path: "study-programmes", component: StudyProgrammeEditor },
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
      {validEnum && <validEnum.component />}
    </div>
  );
};

export default PageAdministrator;
