import { useState } from "react";
import Image from 'next/image';
import InteractiveCard from './InteractiveCard';
import Rating from '@mui/material/Rating';

export default function Card({venueName, imgSrc, onCompare, onRatingChange} : {venueName:string, imgSrc:string, onCompare?:Function, onRatingChange?:Function}) {
    const [rating, setRating] = useState<number | null>(0);
    
    const handleRatingChange = (event: React.SyntheticEvent, newValue: number | null) => {
      setRating(newValue);
      if (onRatingChange) {
        onRatingChange(venueName, newValue);
      }
    };

    return (
        <InteractiveCard contentName={venueName}>
            <div className='w-full h-[70%] relative rounded-t-lg'>
                <Image src={imgSrc}
                alt='Product Picture'
                fill = {true}
                className='object-cover rounded-t-lg'
                /> 
            </div>
            <div className='w-full h-[15%] p-[10px]'><h2>{venueName}</h2></div>
            {
                onCompare?<Rating 
                value={rating}
                onClick={ (e)=>{e.stopPropagation(); onCompare(venueName)}}
                name={`${venueName} Rating`}
                id ={`${venueName} Rating`}
                data-testid={`${venueName} Rating`}
                onChange={handleRatingChange}
                /> : ''
            }
        </InteractiveCard>
    );
}