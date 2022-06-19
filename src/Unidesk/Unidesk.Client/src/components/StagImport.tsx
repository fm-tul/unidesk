import axios from "axios";
import { useState } from "react";
import { API_URL } from "../core/config";

export const StagImport = () => {

    const years = [2021, 2019, 2020, 2022];
    const departments = ["NTI", "MTI", "ITE"];

    const [year, setYear] = useState(years[0]);
    const [department, setDepartment] = useState(departments[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [resposeData, setResponseData] = useState<object>({});

    const importFromStag = async () => {
        setIsLoading(true);
        const response = await axios.get(
            `${API_URL}/api/Import/stag?year=${year}&department=${department}`,
            { withCredentials: true }
        );
        setResponseData(response.data);
        setIsLoading(false);
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <h1>StagImport</h1>

            <select value={year} onChange={(e) => setYear(e.target.value as any)}>
                {years.map(year => <option key={year}>{year}</option>)}
            </select>

            <select value={department} onChange={(e) => setDepartment(e.target.value as any)}>
                {departments.map(department => <option key={department}>{department}</option>)}
            </select>

            <button className="p-2 bg-yellow-600 text-white"
                onClick={importFromStag}>Import</button>

            <code>
                <pre>
                    {`
                        <StagImport year={${year}} department={${department}} />
                    `}
                </pre>
            </code>
            <p>{(resposeData as any).length}</p>
            <code><pre>{JSON.stringify(resposeData, null, 4)}</pre></code>
        </div>
    )
}

export default StagImport;