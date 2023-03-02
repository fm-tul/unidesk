import { KeywordDto, KeywordUsedCount } from "@api-client";
import { LanguageContext } from "@locales/LanguageContext";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { LoadingWrapper } from "components/utils/LoadingWrapper";
import { KeywordsFilterBar } from "filters/KeywordsFilterBar";
import { useOpenClose } from "hooks/useOpenClose";
import { link_pageKeywordDetail } from "routes/links";
import { Button } from "ui/Button";
import { Modal } from "ui/Modal";

import { HistoryInfoIcon } from "../../components/HistoryInfo";
import { KeywordMerger } from "./KeywordMerger";
import { UnideskComponent } from "components/UnideskComponent";

const usedCountOptions = [
  { label: ">1", key: "moreThan1", value: KeywordUsedCount.MORE_THAN1 },
  { label: ">5", key: "moreThan5", value: KeywordUsedCount.MORE_THAN5 },
  { label: ">10", key: "moreThan10", value: KeywordUsedCount.MORE_THAN10 },
];
export const PageKeywordList = () => {
  const { language } = useContext(LanguageContext);

  const [data, setData] = useState<KeywordDto[]>([]);
  const { open, close, isOpen } = useOpenClose();

  const barWidth = 100;
  const theMostFrequent = Math.max(1, Math.max(...data.map(k => k.used ?? 0)));
  const theMostFrequentWidth = (value: number) => (value / theMostFrequent) * barWidth;

  return (
    <UnideskComponent name="PageKeywordList">
      <LoadingWrapper error={""} isLoading={false}>
        <h1>Keywords</h1>
        <Button onClick={open}>Merge Keywords...</Button>

        {isOpen && (
          <Modal open={isOpen} onClose={close} height="xl" className="rounded bg-white p-6">
            <KeywordMerger />
          </Modal>
        )}

        <KeywordsFilterBar onChange={setData} />

        {data && (
          <div className="flex flex-col gap-1">
            {data
              .filter(i => i.locale === language)
              .map(keyword => (
                <div key={keyword.id} className="flex items-center gap-1">
                  <div className="flex h-[14px] justify-end overflow-hidden rounded-xl bg-blue-200" style={{ width: barWidth }}>
                    <div className="bg-blue-500/40" style={{ width: theMostFrequentWidth(keyword.used ?? 0) }}></div>
                  </div>
                  <Button component={Link} to={link_pageKeywordDetail.navigate(keyword.id)} text sm>
                    {keyword.value} ({keyword.used}×)
                  </Button>
                  <HistoryInfoIcon item={keyword as any} />
                </div>
              ))}
          </div>
        )}
      </LoadingWrapper>
    </UnideskComponent>
  );
};

export default PageKeywordList;
