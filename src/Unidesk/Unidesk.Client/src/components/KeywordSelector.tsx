import { GUID_EMPTY } from "@core/config";
import { httpClient } from "@core/init";
import { LanguageContext } from "@locales/LanguageContext";
import { RR } from "@locales/R";
import { KeywordDto } from "@models/KeywordDto";
import { useContext } from "react";
import { MdAdd, MdClear } from "react-icons/md";

import { useDebounceState } from "hooks/useDebounceState";
import { useOpenClose } from "hooks/useOpenClose";
import { Button } from "ui/Button";
import { Modal } from "ui/Modal";
import { classnames } from "ui/shared";
import { TextField } from "ui/TextField";
import { groupBy, sortBy } from "utils/arrays";
import { locales } from "@locales/common";
import { useQuery } from "react-query";
import { useTranslation } from "@locales/translationHooks";

interface KeywordSelectorProps {
  keywords?: KeywordDto[];
  onChange?: (value: KeywordDto[]) => void;
  max?: number;
  separateByLocale?: boolean;
  disabled?: boolean;
}
export const KeywordSelector = (props: KeywordSelectorProps) => {
  const { keywords = [], onChange, max = 100, disabled=false } = props;
  const { language } = useContext(LanguageContext);
  const { translate } = useTranslation(language);

  const [keyword, setKeyword, debounceKw] = useDebounceState<string>("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["keywords", debounceKw],
    queryFn: () => httpClient.keywords.find({ keyword: debounceKw.trim() }),
    enabled: debounceKw.trim() !== "",
  });
  const keywordCandidates = data ?? [];
  const { open, close, isOpen } = useOpenClose();

  const setKeyworsdWithChange = (value: KeywordDto[]) => {
    const unique = value.filter((v, i, a) => a.findIndex(t => t.value === v.value && t.locale === v.locale) === i);
    onChange?.(unique);
  };

  const tryAddKeywordFromOtherLocale = (keyword: KeywordDto) => {
    const toAdd: KeywordDto[] = [];
    locales.forEach(locale => {
      if (locale == keyword.locale) {
        return;
      }

      const found = keywordCandidates.find(k => k.locale == locale && k.value?.toLowerCase() === keyword.value?.toLowerCase());
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
    if (disabled) {
      return;
    }
    setKeyworsdWithChange(keywords.filter(k => k.value !== keyword.value || k.locale !== keyword.locale));
  };

  const byLocale = sortBy([...groupBy(keywords, k => k.locale).entries()], i => i[0], true);

  const KeywordList = (
    <div className="m-1 flex flex-col gap-1">
      {byLocale.map(([locale, keywords]) => (
        <div key={locale} className="flex gap-2">
          <span className="text-neutral-500">{locale}: </span>
          <div className="flex flex-wrap  gap-1">
            {keywords.map((k: KeywordDto) => (
              <div
                onClick={() => removeKeyword(k)}
                key={k.id}
                className={classnames(
                  "group flex cursor-pointer items-center gap-1 rounded-full bg-white px-2 py-px text-sm",
                  LOCALE_COLORS[locale as "cze" | "eng"]
                )}
              >
                {k.value}
                {!disabled && <MdClear className="opacity-50 transition group-hover:opacity-100" />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const hasKeywords = keywords?.length > 0;

  return (
    <div className={classnames("flex flex-col gap-2", disabled && "disabled-style")}>
      <div className="flex">
        {KeywordList}
        <Button text onClick={open} className={classnames(hasKeywords && "ml-auto")} disabled={disabled}>
          {translate(!hasKeywords ? "keywords.add-new" : "click-to-edit")}
        </Button>
      </div>

      {isOpen && (
        <Modal open={isOpen} onClose={close} className="flex flex-col gap-2 bg-white p-4 rounded" width="lg">
          <h3 className="flex items-end justify-between text-sm font-semibold">
            {RR("keywords", language)}
            <Button text sm onClick={close}>
              <MdClear className="text-lg" />
            </Button>
          </h3>
          <div className="relative flex w-full gap-1">
            <TextField
              label={RR("search", language)}
              loading={isLoading}
              value={keyword}
              onValue={setKeyword}
              className="grow"
              onEnter={refetch}
            />
          </div>

          {KeywordList}

          <div>
            {keywordCandidates.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold">{RR("suggested-keywords", language)}</h3>
                <div className="grid min-h-xs w-full grid-cols-2 gap-4 p-2">
                  {locales.map(locale => (
                    <div className="flex grow flex-col items-center" key={locale}>
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
              </div>
            )}
            {keywordCandidates.length === 0 && keyword.length > 0 && (
              <div>
                <div className="">
                  {RR("no-keywords-found", language)}
                  <Button onClick={close} text sm></Button>
                </div>

                <div className="grid grid-cols-2 gap-8 p-2 ">
                  <Button
                    sm
                    outlined
                    info
                    className="p-4"
                    onClick={() => addKeyword({ id: GUID_EMPTY, value: keyword, locale: "eng", used: 0 } as KeywordDto)}
                  >
                    <MdAdd className="text-xl" />
                    {RR("create-new-keyword-for-x", language, "ENG")}
                  </Button>
                  <Button
                    sm
                    outlined
                    success
                    className="p-4"
                    onClick={() => addKeyword({ id: GUID_EMPTY, value: keyword, locale: "cze", used: 0 } as KeywordDto)}
                  >
                    <MdAdd className="text-xl" />
                    {RR("create-new-keyword-for-x", language, "CZE")}
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button text sm onClick={close}>
              {translate("close")}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const LOCALE_COLORS = {
  cze: "text-success-700 ring-1 ring-success-300 transition hover:bg-success-200 hover:ring-success-500",
  eng: "text-info-700 ring-1 ring-info-300 transition hover:bg-info-200 hover:ring-info-500",
};
