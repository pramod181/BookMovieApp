import React, {useState} from 'react';
import StarBorderIcon from '@material-ui/icons/StarBorder';

export default function StarRating() {
const [starIcons, setStarIcons] = useState([{
    id: 1,
    stateId: "star1",
    color: "black"
},
{
    id: 2,
    stateId: "star2",
    color: "black"
},
{
    id: 3,
    stateId: "star3",
    color: "black"
},
{
    id: 4,
    stateId: "star4",
    color: "black"
},
{
    id: 5,
    stateId: "star5",
    color: "black"
}]);

const starClickHandler = (id) => {
    let starIconList = [];
    for (let star of starIcons) {
        let starNode = star;
        if (star.id <= id) {
            starNode.color = "yellow"
        }
        else {
            starNode.color = "black";

        }
        starIconList.push(starNode);
    }
    setStarIcons(starIconList);
}



    return (
        <div>
            {starIcons.map(star => (
                <StarBorderIcon style={{color:star.color}} key={star.id} onClick={()=>starClickHandler(star.id)}/>
            ))}
        </div>

    )
}