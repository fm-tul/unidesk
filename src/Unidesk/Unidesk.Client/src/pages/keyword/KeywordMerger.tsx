import { httpClient } from "@core/init";
import { locales } from "@locales/all";
import { SimilarKeywordDto } from "@models/SimilarKeywordDto";
import { UnideskComponent } from "components/UnideskComponent";
import { useState } from "react";
import { Button } from "ui/Button";
import { TextField } from "ui/TextField";
import { serverResponseOrDefault } from "utils/jsonUtils";

interface KeywordMergerProps {}

export const KeywordMerger = (props: KeywordMergerProps) => {
  const [duplicates, setDuplicates] = useState<SimilarKeywordDto[] | null>();
  const [duplicatesKeyword, setDuplicatesKeyword] = useState<string>();
  const [selectedSimilarKeywords, setSelectedSimilarKeywords] = useState<[string, string][]>([]);
  const [error, setError] = useState<string>();
  const allSelectedMains = selectedSimilarKeywords.map(i => i[0]);
  const allSelectedAliases = selectedSimilarKeywords.map(i => i[1]);

  const handleFindDuplicatesButtonClick = async () => {
    setDuplicates(null);
    setError("");
    const dupes = await httpClient.keywords.findDuplicates({ keyword: duplicatesKeyword }).catch((e: unknown) => {
      setDuplicates([]);
      const serverError = serverResponseOrDefault(e);
      if (serverError) {
        setError(serverError.message ?? "Error occured");
      }
      return [];
    });
    setDuplicates(dupes);
  };

  const toggleMergePair = async (a: string, b: string) => {
    const existingIndex = selectedSimilarKeywords.findIndex(item => (item[0] === a && item[1] === b) || (item[0] === b && item[1] === a));
    if (existingIndex !== -1) {
      // remove
      setSelectedSimilarKeywords([...selectedSimilarKeywords.filter((i, j) => j !== existingIndex)]);
      return;
    }

    if (allSelectedMains.includes(a) || allSelectedMains.includes(b) || allSelectedAliases.includes(a) || allSelectedAliases.includes(b)) {
      return;
    }

    setSelectedSimilarKeywords([...selectedSimilarKeywords, [a, b]]);
  };

  const handleMergeButtonClick = async () => {
    const dto = { pairs: selectedSimilarKeywords.map(i => ({ main: i[0], alias: i[1] })) };
    await httpClient.keywords.mergeMultiple({ requestBody: dto });
    await handleFindDuplicatesButtonClick();
    setSelectedSimilarKeywords([]);
  };

  return (
    <UnideskComponent name="KeywordMerger">
      <div className="flex gap-2">
        <Button loading={duplicates === null} onClick={handleFindDuplicatesButtonClick}>
          Find&nbsp;Duplicates
        </Button>
        <TextField value={duplicatesKeyword} onValue={setDuplicatesKeyword} onEnter={handleFindDuplicatesButtonClick} />
        {selectedSimilarKeywords.length > 0 && (
          <Button warning onClick={handleMergeButtonClick}>
            Merge
          </Button>
        )}
      </div>
      {error && <div className="p-4 text-red-500">{error}</div>}
      {!!duplicates && !error && (
        <div className="flex flex-col gap-1">
          {locales.map(locale => (
            <div key={locale}>
              <h3 className="text-2xl">{locale}</h3>
              <div className="grid grid-cols-2 gap-1 font-mono">
                {duplicates
                  .filter(i => i.locale == locale)
                  .map(i => {
                    const [a, b] = [i.keyword1!.id, i.keyword2!.id];
                    const similarity = Math.round(i.similarity! * 100);
                    const cssA = allSelectedMains.includes(a)
                      ? "bg-success-200 border-success-500"
                      : allSelectedAliases.includes(a)
                      ? "bg-error-200 border-error-500"
                      : similarity > 99
                      ? "border-success-400 bg-success-100"
                      : similarity > 50
                      ? "border-sky-500 bg-sky-100"
                      : "border-purple-500 bg-purple-100";
                    const cssB = allSelectedMains.includes(b)
                      ? "bg-success-200 border-success-500"
                      : allSelectedAliases.includes(b)
                      ? "bg-error-200 border-error-500"
                      : similarity > 99
                      ? "border-success-400 bg-success-100"
                      : similarity > 50
                      ? "border-teal-400 bg-teal-100"
                      : "border-fuchsia-500 bg-fuchsia-100";

                    return (
                      <div key={`${a}-${b}`} className="grid grid-cols-[1fr_2rem_1fr] gap-2 ">
                        <span className="text-right">
                          <span onClick={() => toggleMergePair(a, b)} className={`pill ${cssA} cursor-pointer`}>
                            {i.keyword1?.value}
                          </span>
                        </span>
                        <Button sm outlined success onClick={() => toggleMergePair(a, b)}>
                          {similarity}
                        </Button>
                        <span>
                          <span onClick={() => toggleMergePair(b, a)} className={`pill ${cssB} cursor-pointer`}>
                            {i.keyword2?.value}
                          </span>
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      )}
    </UnideskComponent>
  );
};
