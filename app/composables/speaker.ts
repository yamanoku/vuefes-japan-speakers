export const useFetchSpeaker = async (params?: string | string[]) => {
  const { data: allSpeakers } = await useFetch("/api/speakers");
  const filterYearSpeaker = allSpeakers.value?.filter(
    (speaker) => speaker.year === params
  );
  const filterNameSpeaker = allSpeakers.value?.filter(
    (speaker) => speaker.name === params
  );
  return { allSpeakers, filterYearSpeaker, filterNameSpeaker };
};
