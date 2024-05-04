import React, {Dispatch} from "react";
import PopoverButton from "../PopoverButton";
import {Casino} from "@mui/icons-material";

type RandomizeButtonProps = {
    onStart: Dispatch<void>
}

function RandomizeButton({onStart}: RandomizeButtonProps) {
    return <PopoverButton
        buttonProps={{size: 'large', startIcon: <Casino/>, variant: 'contained', children: 'Randomize'}}
        positiveLabel="Start"
        onPositiveClick={onStart}
    />;
}

export default RandomizeButton;
