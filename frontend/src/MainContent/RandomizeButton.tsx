import {GameSettings, SongGenre} from "../types";
import React, {Dispatch, useState} from "react";
import {List, ListItem, ListItemText, MenuItem, Select} from "@mui/material";
import PopoverButton from "../PopoverButton";
import {Casino} from "@mui/icons-material";

type RandomizeButtonProps = {
    defaultSettings: GameSettings
    onStart: Dispatch<GameSettings>
}

function RandomizeButton({defaultSettings, onStart}: RandomizeButtonProps) {
    const [genre, setGenre] = useState<SongGenre | 'any'>(defaultSettings.genre);

    return <PopoverButton
        buttonProps={{size: 'large', startIcon: <Casino/>, variant: 'contained', children: 'Randomize'}}
        positiveLabel="Start"
        onPositiveClick={() => onStart({genre})}
    >
        <List sx={{width: '20em'}}>
            <ListItem>
                <ListItemText>Genre</ListItemText>
                <Select size="small" value={genre} onChange={event => setGenre(event.target.value as SongGenre)}>
                    <MenuItem value={'any'}>Any</MenuItem>
                    <MenuItem value={'Israeli Rock'}>Israeli Rock</MenuItem>
                    <MenuItem value={'Pop'}>Pop</MenuItem>
                    <MenuItem value={'Rap'}>Rap</MenuItem>
                    <MenuItem value={'Rock'}>Rock</MenuItem>
                </Select>
            </ListItem>
        </List>
    </PopoverButton>;
}

export default RandomizeButton;
