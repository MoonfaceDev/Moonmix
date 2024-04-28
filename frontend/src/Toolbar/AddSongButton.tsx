import {Add} from "@mui/icons-material";
import React, {Dispatch, useState} from "react";
import {
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    MenuItem,
    TextField,
    TextFieldProps
} from "@mui/material";
import PopoverButton from "../PopoverButton";
import {api} from "../api";
import {SongGenre} from "../types";
import {enqueueSnackbar} from "notistack";

type PopoverTextFieldProps = {
    label: string
    value: string
    onChange: Dispatch<string>
    textFieldProps?: Partial<TextFieldProps>
}

function PopoverTextField({label, value, onChange, textFieldProps}: PopoverTextFieldProps) {
    return <ListItem>
        <ListItemText>{label}</ListItemText>
        <ListItemSecondaryAction>
            <TextField sx={{width: '10em'}} size="small" value={value}
                       onChange={event => onChange(event.target.value)} {...textFieldProps}/>
        </ListItemSecondaryAction>
    </ListItem>
}

function AddSongButton() {
    const [url, setUrl] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [artist, setArtist] = useState<string>('');
    const [genre, setGenre] = useState<SongGenre>('Rock');
    const [year, setYear] = useState<string>('1970');
    const [upload] = api.useUploadYoutubeMutation();

    return <PopoverButton
        buttonProps={{size: 'large', startIcon: <Add/>, variant: 'outlined', children: 'Add song'}}
        positiveLabel="Upload"
        onPositiveClick={() => upload({url, song_metadata: {title, artist, genre, year: Number(year)}}).then(() => {
            enqueueSnackbar('Song upload is queued', {variant: 'info'});
        })}
    >
        <List sx={{width: '20em'}}>
            <PopoverTextField label="Youtube URL" value={url} onChange={setUrl}/>
            <PopoverTextField label="Title" value={title} onChange={setTitle}/>
            <PopoverTextField label="Artist" value={artist} onChange={setArtist}/>
            <PopoverTextField label="Genre" value={genre} onChange={value => setGenre(value as SongGenre)}
                              textFieldProps={{
                                  select: true,
                                  children: [
                                      <MenuItem value={'Israeli Rock'}>Israeli Rock</MenuItem>,
                                      <MenuItem value={'Pop'}>Pop</MenuItem>,
                                      <MenuItem value={'Rap'}>Rap</MenuItem>,
                                      <MenuItem value={'Rock'}>Rock</MenuItem>,
                                  ],
                              }}/>
            <PopoverTextField label="Year" value={year} onChange={setYear}/>
        </List>
    </PopoverButton>;
}

export default AddSongButton;
