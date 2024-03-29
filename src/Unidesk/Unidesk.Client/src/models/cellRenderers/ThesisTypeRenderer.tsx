import { ThesisDto } from "@models/ThesisDto";
import { ThesisLookupDto } from "@models/ThesisLookupDto";
import { ThesisTypeDto } from "@models/ThesisTypeDto";

export const ThesisTypeRendererFactory = (allTypes: ThesisTypeDto[]) => {
  const ThesisTypeRenderer = (params: ThesisDto | ThesisLookupDto) => {
    const types = params.thesisTypeCandidateIds;
    if (types.length === 0) return null;
    const mapped = types.map(id => {
      const type = allTypes.find(t => t.id === id);
      return type?.code ?? type?.nameCze ?? type?.nameEng ?? id;
    });

    return <span>{mapped.join(", ")}</span>;
  };

  return ThesisTypeRenderer;
};
