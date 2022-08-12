import moment from "moment";

export const DateOnlyRendererFor = (key: string) => {
  const DateOnlyRenderer = (params: any) => {
    const value = params.row[key];
    const dt = moment(value).format("DD/MM-YYYY");
    return <span>{dt}</span>;
  };

  return DateOnlyRenderer;
};
