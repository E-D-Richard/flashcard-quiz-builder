import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import ROUTES from "../app/routes";
import { useSelector, useDispatch } from "react-redux";
import { selectTopics } from "../features/topics/topicsSlice";
import { addQuizWithTopicId } from "../features/quizzes/quizzesSlice";
import { addCard } from "../features/cards/cardsSlice";

export default function NewQuizForm() {
  const [name, setName] = useState("");
  const [cards, setCards] = useState([]);
  const [topicId, setTopicId] = useState("");
  const history = useHistory();
  const dispatch = useDispatch();
  const topics = useSelector(selectTopics);

  const handleSubmit = (e) => {
    e.preventDefault();
    

    //prevents blank quiz name, quiz topic or blank card submitions
    const cardIsBlank = cards.some((card) => card.front.length === 0 || card.back.length === 0);
    const noTopic = !topicId ? true : false;
    if (name.length === 0 || noTopic || cardIsBlank) return;

    /* dipatches all new the new cards from "cards"  while adding an "id" property.
    The loop also updates the "cardIds" array */
    const cardIds = [];
    cards.forEach((card) => {
      const cardId = uuidv4();
      cardIds.push(cardId);
      dispatch(
        addCard({
          id: cardId,
          ...card,
        })
      );
    });

    //prevents creating quiz with zero cards
    if (cardIds.length === 0) return;
    const quizId = uuidv4();
    dispatch(
      addQuizWithTopicId({
        id: quizId,
        name: name,
        topicId: topicId,
        cardIds: cardIds,
      })
    );

    history.push(ROUTES.quizzesRoute());
  };

  const addCardInputs = (e) => {
    e.preventDefault();
    setCards(cards.concat({ front: "", back: "" }));
  };

  const removeCard = (e, index) => {
    e.preventDefault();
    setCards(cards.filter((card, i) => i !== index));
  };

  const updateCardState = (index, side, value) => {
    const newCards = cards.slice();
    newCards[index][side] = value;
    setCards(newCards);
  };

  return (
    <section>
      <h1>Create a new quiz</h1>
      <form onSubmit={handleSubmit}>
        <input
          id="quiz-name"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Quiz Title"
        />
        <select
          id="quiz-topic"
          onChange={(e) => setTopicId(e.currentTarget.value)}
          placeholder="Topic"
        >
          <option value="">Topic</option>
          {Object.values(topics).map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>
        {cards.map((card, index) => (
          <div key={index} className="card-front-back">
            <input
              id={`card-front-${index}`}
              value={cards[index].front}
              onChange={(e) =>
                updateCardState(index, "front", e.currentTarget.value)
              }
              placeholder="Front"
            />

            <input
              id={`card-back-${index}`}
              value={cards[index].back}
              onChange={(e) =>
                updateCardState(index, "back", e.currentTarget.value)
              }
              placeholder="Back"
            />

            <button
              onClick={(e) => removeCard(e, index)}
              className="remove-card-button"
            >
              Remove Card
            </button>
          </div>
        ))}
        <div className="actions-container">
          <button onClick={addCardInputs}>Add a Card</button>
          <button>Create Quiz</button>
        </div>
      </form>
    </section>
  );
}
