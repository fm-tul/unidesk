import { EMPTY_GUID } from "@core/config";
import { httpClient } from "@core/init";
import { KeywordDto } from "@models/KeywordDto";
import { useState } from "react";
import { MdChecklist, MdClear } from "react-icons/md";

import { useOpenClose } from "hooks/useOpenClose";
import { Button } from "ui/Button";
import { TextField } from "ui/TextField";

interface KeywordSelectorProps {
  keywords?: KeywordDto[];
  onChange?: (value: KeywordDto[]) => void;
  max?: number;
  separateByLocale?: boolean;
}
export const KeywordSelector = (props: KeywordSelectorProps) => {
  const { keywords=[], onChange, max = 100, separateByLocale = false } = props;
  // const [keywords, setKeywords] = useState<KeywordDto[]>(defaultValue ?? []);
  const [keywordCandidates, setKeywordCandidates] = useState<KeywordDto[]>([]);
  const [keyword, setKeyword] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { open, close, isOpen } = useOpenClose();
  const locales = ["cze", "eng"];

  const setKeyworsdWithChange = (value: KeywordDto[]) => {
    // remove duplicates
    const unique = value.filter((v, i, a) => a.findIndex(t => t.value === v.value && t.locale === v.locale) === i);
    // setKeywords(unique);
    onChange?.(unique);
  };

  const handleEnter = async () => {
    if (keyword.trim() === "" || isLoading) {
      return;
    }

    setIsLoading(true);
    const dto = await httpClient.keywords.find({ keyword });
    setKeywordCandidates(dto);
    setIsLoading(false);
    open();
  };

  const tryAddKeywordFromOtherLocale = (keyword: KeywordDto) => {
    const toAdd: KeywordDto[] = [];
    locales.forEach(locale => {
      if (locale == keyword.locale) {
        return;
      }

      const found = keywordCandidates.find(k => k.locale == locale && k.value === keyword.value);
      if (found) {
        toAdd.push(found);
      }
    });
    return toAdd;
  };

  const addKeyword = (keyword: KeywordDto) => {
    const isThere = keywords.find(k => k.id === keyword.id && k.locale === keyword.locale);
    if (isThere) {
      removeKeyword(keyword);
      return;
    }

    if (keywords.length >= max) {
      return;
    }

    setKeyworsdWithChange([...keywords, keyword, ...tryAddKeywordFromOtherLocale(keyword)]);
  };

  const removeKeyword = (keyword: KeywordDto) => {
    setKeyworsdWithChange(keywords.filter(k => k.value !== keyword.value || k.locale !== keyword.locale));
  };

  return (
    <div className="col-span-2 flex flex-col gap-2">
      <div className="relative flex w-full gap-1">
        <TextField loading={isLoading} value={keyword} onValue={setKeyword} className="grow" onEnter={handleEnter} />
        <Button text sm loading={isLoading}>
          <MdChecklist className="text-base" />
        </Button>
      </div>

      <div className="flex flex-col gap-1">
        {locales.map(locale => (
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-sm font-semibold">{locale}: </span>
            {keywords
              .filter(i => i.locale === locale)
              .map(i => (
                <Button key={i.id} text sm success outlined className="rounded-full" onClick={() => removeKeyword(i)}>
                  {i.value} ({i.locale}) <MdClear className="text-base" />
                </Button>
              ))}
          </div>
        ))}

        {/* modal holder */}
        <div className="relative" onKeyDown={e => e.key === "Escape" && close()}>
          {isOpen && (
            <>
              {keywordCandidates.length > 0 && (
                <div className="absolute left-0 z-10 grid w-max grid-cols-2 gap-4 rounded border border-solid border-neutral-200 bg-white p-2 shadow-xl">
                  <div className="col-span-2 flex w-full justify-between border-b border-solid border-black/30 p-2 text-sm font-semibold">
                    Suggetisons
                    <Button onClick={close} text sm>
                      <MdClear className="text-base" />
                    </Button>
                  </div>
                  {locales.map(locale => (
                    <div className="flex flex-col items-center">
                      {locale}
                      <div className="flex flex-col gap-1">
                        {keywordCandidates
                          .filter(i => i.locale == locale)
                          .map(i => (
                            <Button
                              key={i.id}
                              sm
                              justify="justify-start"
                              color={keywords.some(j => j.id === i.id) ? "success" : "warning"}
                              text
                              className="rounded-full"
                              onClick={() => addKeyword(i)}
                            >
                              <span className="text-xxs">({i.used}×)</span> {i.value}
                            </Button>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {keywordCandidates.length === 0 && (
                <div className="absolute left-0 z-10 grid w-max grid-cols-1 gap-4 rounded border border-solid border-neutral-200 bg-white p-2 shadow-xl">
                  <div className="flex w-full justify-between border-b border-solid border-black/30 p-2 text-sm font-semibold">
                    No keywords found
                    <Button onClick={close} text sm>
                      <MdClear className="text-base" />
                    </Button>
                  </div>
                  <div className="flex flex-col items-center">
                    <Button sm text success onClick={() => addKeyword({ id: EMPTY_GUID, value: keyword, locale: "cze", used: 0 } as KeywordDto)}>
                      Create new keyword for <em>CZE</em> language
                    </Button>
                    <Button sm text info onClick={() => addKeyword({ id: EMPTY_GUID, value: keyword, locale: "eng", used: 0 } as KeywordDto)}>
                      Create new keyword for <em>ENG</em> language
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
