import { getMainBanner, getMainPopularParties } from '../api/mainApi';

export const loadMainPageData = async () => {
  const [bannerRes, popularRes] = await Promise.all([
    getMainBanner(),
    getMainPopularParties(),
  ]);

  return {
    banner: bannerRes.data?.data || null,
    popular: popularRes.data?.data || [],
  };
};
