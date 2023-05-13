import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || ''
});
const openai = new OpenAIApi(configuration);

interface State {
  interests: string[];
  notInterests: string[];
  profession: string;
  userProfession: string;
}

export async function updateState(state: State, message: string) {
  const prompt = `
    an api accepts the data in the following format only:
    """
    {
        "interests": [],
        "notInterests": [],
        "profession": "",
        "userProfession": ""
    }
    """
    return the data in form of the above json object 

    the current value of the above object is ${JSON.stringify(state)}
    
    where "interests" is the list of all the interests i want in my peer, "notInterests" is the list of all the interests that i dont want in my peer, "profession" is the profession of my peer and "userProfession" is my profession
    And give me only the json object, no text, nothing at all
    
    the user message is ${message}, update the current value and return the json object
        `;

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt,
    temperature: 0.8,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0
  });
  const newState = JSON.parse(response.data.choices[0].text as string) as State;
  state.interests = newState.interests;
  state.notInterests = newState.notInterests;
  state.profession = newState.profession;
  state.userProfession = newState.userProfession;
  return state;
}
