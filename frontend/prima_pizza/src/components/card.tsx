// Custom Imports
import { styles } from "../app/dashboard/styles";

const Card = ({ pizzaToppingData, typeData }) => {

  return (
    <div style={styles.cardAlt}>
      <h3>{typeData}</h3>
      <p style={styles.cardContents}>{pizzaToppingData[typeData]}</p>
    </div>
  )
}


export default Card;
