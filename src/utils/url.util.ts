export const getParams = (
  searchParams: URLSearchParams,
): {
  [k: string]: string;
} => {
  return Object.fromEntries(searchParams.entries());
};

export const urlToFile = async (url: string, fileName: string): Promise<File> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};
