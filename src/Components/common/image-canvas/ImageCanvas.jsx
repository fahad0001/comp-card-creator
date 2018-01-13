import React from 'react';

export const ImageCanvas = ({containerStyle, imageStyleData, textDataRender, onClickImage, imageStore}) => (
    <div style={containerStyle}>
        {imageStore.map((image, key) => {
            return (
                <div key={key} style={imageStyleData && imageStyleData[key].divStyle}>
                    <img style={imageStyleData && imageStyleData[key].imgStyle} src={image} alt="not-found"  onClick={() => onClickImage(key)}/>
                </div>
            );
        })}
        {textDataRender}
    </div>
);
