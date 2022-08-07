import { Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { KeywordDto } from "@api-client";
import { HistoryInfoIcon } from "../../components/HistoryInfo";
import { RequestInfo } from "../../components/utils/RequestInfo";
import { httpClient } from "@core/init";
import { useFetch } from "../../hooks/useFetch";
import { LanguageContext } from "@locales/LanguageContext";
import { Translate } from "@locales/R";

export const PageKeywordList = () => {
  const { error, isLoading, data } = useFetch(() => httpClient.keywords.getAll({ pageSize: 30 * 2 }));
  const keywords = (data as KeywordDto[] | undefined) ?? [];
  const { language } = useContext(LanguageContext);

  const barWidth = 100;
  const theMostFrequent = Math.max(1, Math.max(...keywords.map((k) => k.used ?? 0)));
  const theMostFrequentWidth = (value: number) => (value / theMostFrequent) * barWidth;

  return (
    <div>
      <h1>Keywords {}</h1>
      <RequestInfo error={error} isLoading={isLoading} />
      {keywords && (
        <div className="flex flex-col gap-1">
          {keywords
            .filter((i) => i.locale === language)
            .map((keyword) => (
              <div key={keyword.id} className="flex items-center gap-1">
                <div className="flex h-[14px] justify-end overflow-hidden rounded-xl bg-blue-200" style={{ width: barWidth }}>
                  <div className="bg-blue-500/40" style={{ width: theMostFrequentWidth(keyword.used ?? 0) }}></div>
                </div>
                <Button component={Link} to={`/keywords/${keyword.id}`} size="small">
                  {keyword.value} ({keyword.used}×)
                </Button>
                <HistoryInfoIcon item={keyword as any} />
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default PageKeywordList;
