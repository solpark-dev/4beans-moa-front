import * as partyApi from "@/api/partyApi";

export const fetchPartyList = async (params) => {
  // axios: res.data.data
  // fetch: res.data (res is body)
  // But wait, getPartyList in api.js was NOT updated in my previous turn?
  // Let me check the previous turn's replacement.
  // I replaced lines 1-13 (imports and createParty etc).
  // I did NOT replace getPartyList in the previous turn?
  // I replaced the WHOLE file content in partyApi.js.
  // So getPartyList IS using fetch now (if I included it).
  // I missed getPartyList in the replacement content of partyApi.js!
  // I need to check partyApi.js again.
  const res = await partyApi.getPartyList(params);
  return res.data;
};

export const fetchPartyDetail = async (id) => {
  const res = await partyApi.getPartyDetail(id);
  return res.data;
};

export const createParty = async (data) => {
  const res = await partyApi.createParty(data);
  return res.data;
};

export const joinParty = async (partyId, paymentData) => {
  const res = await partyApi.joinParty(partyId, paymentData);
  return res.data;
};

export const leaveParty = async (partyId) => {
  await partyApi.leaveParty(partyId);
};

export const fetchMyParties = async () => {
  const res = await partyApi.getMyParties();
  return res.data;
};

export const fetchPartyMembers = async (partyId) => {
  const res = await partyApi.getPartyMembers(partyId);
  return res.data;
};

export const processLeaderDeposit = async (partyId, paymentData) => {
  const res = await partyApi.processLeaderDeposit(partyId, paymentData);
  return res.data;
};

export const fetchProducts = async () => {
  const res = await partyApi.getProducts();
  return res.data;
};

export const updateOttAccount = async (partyId, ottData) => {
  const res = await partyApi.updateOttAccount(partyId, ottData);
  return res.data;
};
