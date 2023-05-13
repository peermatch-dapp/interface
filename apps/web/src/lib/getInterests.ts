import { gql, nodeClient } from 'lens/apollo';

export const LENS_API_PROD = 'https://api.lens.dev/';

const getInterests = async () => {
  const myInterestsQuery = gql`
    query Profile {
      profile(request: { profileId: "0x0e29" }) {
        id
        interests
      }
    }
  `;

  const myInterests: any = await nodeClient.query({ query: myInterestsQuery });
  const interests = myInterests?.data.profile.interests;

  const followersQuery = gql`
    query Followers {
      followers(request: { profileId: "0x0e29", limit: 50 }) {
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
    console.log(p);
    const commonInterests = p.interests.filter((element: any) => {
      return interests.includes(element);
    });
    if (commonInterests.length > 0) {
      data.push({
        address: p.ownedBy,
        commonInterests,
        numberInCommon: commonInterests.length,
        name: p.name
      });
    }
  }
  return data;
};

export default getInterests;
