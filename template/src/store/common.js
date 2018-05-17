export const state = {
  count: 0
};

export const mutations = {
  increment(state) {
    state.count++;
  }
};

export const getters = {
  doubleCount(state) {
    return state.count * 2;
  }
};

export const actions = {
  incrementTwice({ commit }) {
    commit(`increment`);
    commit(`increment`);
  }
};