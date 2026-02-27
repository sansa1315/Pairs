import { useEffect, useState } from 'react';
import './App.css';
import { Container, SimpleGrid, Box, Heading, useFormControlStyles } from '@chakra-ui/react';
import { shuffle } from 'lodash';
import Card from "./components/CardComponent"

function App() {
  const [initialState, setInitialState] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    // Build the full set of unique card image names (e.g. "A C", "10H" -> "AC", "10H")
    const tipos = ['C', 'D', 'H', 'S'];
    const specialValue = {
      11: 'J',
      12: 'Q',
      13: 'K',
      1: 'A',
    };

    // Generate all possible image names (52 cards)
    const allImageNames = [];
    for (let number = 1; number <= 13; number++) {
      for (const tipo of tipos) {
        const label = number in specialValue ? specialValue[number] : number;
        allImageNames.push(`${label}${tipo}`);        
      }
    }

    // How many unique pairs we want (16 unique cards -> 16 pairs when duplicated)
    const uniqueCount = 16;

    // Shuffle the full deck and pick the first `uniqueCount` distinct images
    const picked = shuffle(allImageNames).slice(0, uniqueCount);

    // Create card objects, duplicate each one to form one pair, then shuffle final deck
    const initialArray = picked.map(name => ({ image: name, status: true }));
    let finalArray = [...initialArray, ...initialArray.map(card => ({ ...card }))];
    finalArray = shuffle(finalArray);

    setInitialState(finalArray);

    // After a short preview, flip all cards face-down
    setTimeout(() => {
      setInitialState(prevState => prevState.map(card => ({ ...card, status: false })));
    }, 5000);

  }, []);

  const shuffleUnflippedCard = () => {
    let sampleArr = [];
    let indexArr = [];
    initialState.forEach((card, index) => {
      if (!card.status) {
        sampleArr.push({...card});
        indexArr.push(index);
      }
    });
    sampleArr = shuffle(sampleArr);
    let newArr = [...initialState];

    indexArr.forEach((indexCard, i) => {      
      newArr[indexCard] = sampleArr[i];
    });

    setInitialState(newArr);
  }

  const flipCard = (index) => {    
    if (flippedCards.length === 2 || initialState[index].status) {
      return;
    }

    let newState = [...initialState];
    let card = newState[index];
    card.status = !card.status;
    setInitialState(newState);

    const newFlippedCards = [...flippedCards, { ...card, index }];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      if (newFlippedCards[0].image === newFlippedCards[1].image) {
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          let resetState = [...initialState];
          let [first, second] = [...newFlippedCards];
          resetState[first.index].status = false;
          resetState[second.index].status = false;
          setInitialState(resetState);
          setFlippedCards([]);
          setCounter(prevCounter => {
            const newCounter = prevCounter + 1;
            if (newCounter === 200) {
              shuffleUnflippedCard();
              return 0;
            }
            return newCounter;
          });
        }, 1000); // Espera 1 segundo antes de voltear las cartas nuevamente
      }
    }
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Container maxW="container.lg">
          <SimpleGrid columns={8} spacing={10}>
            {initialState.map((card, i) => (
              <Card card={card} key={i} index={i} flipCard={flipCard}/>
            ))}
          </SimpleGrid>
        </Container>
        <Box>
          <Heading>
            Contador {counter}
          </Heading>
        </Box>
      </Box>
    </>
  );
}

export default App;
