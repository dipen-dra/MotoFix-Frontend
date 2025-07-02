import React from 'react';

// A styled button component for consistency
const OptionButton = ({ text, handler }) => (
    <button
        onClick={handler}
        className="chatbot-option-button"
    >
        {text}
    </button>
);

const GeneralOptions = (props) => {
    // This component will receive an array of options from the ActionProvider
    const { options } = props;

    return (
        <div className="chatbot-options-container">
            {options.map((option, index) => (
                <OptionButton key={index} text={option.text} handler={option.handler} />
            ))}
        </div>
    );
};

export default GeneralOptions;