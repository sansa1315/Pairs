import { Box } from "@chakra-ui/react"

const Card = ({card, index, flipCard }) => {
    return (
        <Box className='card-container'>
            <div className={`card-body ${card.status ? "card-body-clicked" : ""}`} onClick={() => flipCard(index)}>
                <img
                    className='back-card'
                    src={`/images/grey_back.png`}
                    alt="Card back"
                />
                <img
                    className='front-card'
                    src={`/images/${card.image}.png`}
                    alt={card.image}
                />
            </div>
        </Box>
    )
}


export default Card