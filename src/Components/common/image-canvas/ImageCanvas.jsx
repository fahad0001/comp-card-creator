import React from 'react';

export const ImageCanvas = ({containerStyle, imageStyleData, textStyleData, textData, onClickImage, imageStore}) => (
    <div style={containerStyle}>
        {imageStore.map((image, key) => {
            return (
                <div key={key} style={imageStyleData && imageStyleData[key].divStyle}>
                    <img style={imageStyleData && imageStyleData[key].imgStyle} src={image} alt="not-found"  onClick={() => onClickImage(key)}/>
                </div>
            );
        })}
        <ul style={textStyleData}>
            <li>Sex: {textData.sex}</li>
            <li>Height: {textData.height}</li>
            <li>Chest: {textData.chest}</li>
            <li>Waist: {textData.waist}</li>
            <li>Hip: {textData.hip}</li>
            <li>Eyes: {textData.eyes}</li>
            <li>Hair: {textData.hair}</li>
            <li>Shoes: {textData.shoes}</li>
        </ul>
    </div>
);
