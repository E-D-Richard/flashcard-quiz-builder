import {createSlice} from '@reduxjs/toolkit';

const initialState = {
    topics: {}
}

const topicsSlice = createSlice({
    name: 'topics',
    initialState: initialState,
    reducers: {
        addTopic: (state, action) => {
            state.topics[action.payload.id] = {...action.payload, quizIds: []};
        },
        addQuizIds: (state, action) => {
            state.topics[action.payload.topicId].quizIds.push(action.payload.quizId);   
        }
    },
})

export const selectTopics = (state) => state.topics.topics;
export const { addTopic, addQuizIds } = topicsSlice.actions;
export default topicsSlice.reducer;