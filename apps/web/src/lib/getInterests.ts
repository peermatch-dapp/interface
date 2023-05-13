import { gql, nodeClient } from 'lens/apollo';

export const LENS_API_PROD = 'https://api.lens.dev/';

const getInterests = async (profileId: string | string[]) => {
  const myInterestsQuery = gql`
    query Profile {
      profile(request: { profileId: "${profileId}" }) {
        id
        interests
      }
    }
  `;

  const myInterests: any = await nodeClient.query({ query: myInterestsQuery });
  const interests = myInterests?.data.profile.interests;

  const followersQuery = gql`
    query Followers {
      followers(request: { profileId: "${profileId}", limit: 50 }) {
        items {
          wallet {
            address
            defaultProfile {
              id
              name
              interests
              ownedBy
            }
          }
        }
      }
    }
  `;
  const followers = await nodeClient.query({
    query: followersQuery
  });
  const items = followers.data?.followers?.items;
  const data = [];
  for (const item of items) {
    const commonInterests = item.wallet.defaultProfile.interests.filter(
      (element: any) => {
        return interests.includes(element);
      }
    );
    if (commonInterests.length > 0) {
      data.push({
        address: item.wallet.defaultProfile.ownedBy,
        commonInterests,
        numberInCommon: commonInterests.length,
        name: item.wallet.defaultProfile.name
      });
    }
  }
  const recommandationsQuery = gql`
    query RecommendedProfiles {
      recommendedProfiles {
        id
        name
        interests
        ownedBy
      }
    }
  `;
  const recommandations = await nodeClient.query({
    query: recommandationsQuery
  });
  // console.log(recommandations.data.recommendedProfiles);
  for (const p of recommandations.data.recommendedProfiles) {
    // console.log(p);
    const commonInterests = p.interests.filter((element: any) => {
      return interests.includes(element);
    });
    if (commonInterests.length > 0) {
      data.push({
        address: p.ownedBy,
        commonInterests,
        numberInCommon: commonInterests.length,
        id: p.id,
        name: p.name
      });
    }
  }
  const limit = 5;
  return data
    .sort((a: any, b: any) => b?.numberInCommon - a?.numberInCommon)
    .slice(0, limit);
};

export default getInterests;
