export const useFetchSpeaker = async (params?: string) => {
  const { data: allSpeakers } = await useFetch("/api/speakers");
  const filterYearSpeaker = allSpeakers.value?.filter(
    (speaker) => speaker.year === params
  );
  const filterNameSpeaker = allSpeakers.value?.filter(
    (speaker) => {
      if (params !== undefined && speaker.name.includes(params)) {
        return speaker;
      }
    }
  );
  return { allSpeakers, filterYearSpeaker, filterNameSpeaker };
};
