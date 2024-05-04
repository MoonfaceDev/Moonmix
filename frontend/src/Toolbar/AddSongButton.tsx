import {Add} from "@mui/icons-material";
import React, {useCallback, useMemo, useState} from "react";
import {
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    TextField,
    ToggleButton,
    ToggleButtonGroup
} from "@mui/material";
import PopoverButton from "../PopoverButton";
import {api} from "../api";
import {enqueueSnackbar} from "notistack";

type SourceType = 'youtube' | 'spotify';

function AddSongButton() {
    const [uploadYoutube] = api.useUploadYoutubeMutation();
    const [uploadSpotify] = api.useUploadSpotifyMutation();

    const [sourceType, setSourceType] = useState<SourceType>('youtube');
    const [url, setUrl] = useState<string>('');

    const uploadPromises = useMemo<Record<SourceType, () => Promise<void>>>(() => ({
        youtube: () => uploadYoutube({url}).unwrap(),
        spotify: () => uploadSpotify({url}).unwrap(),
    }), [uploadYoutube, uploadSpotify, url]);

    const onSubmit = useCallback(async () => {
        await uploadPromises[sourceType]();
        enqueueSnackbar('Song upload is queued', {variant: 'info'});
    }, [uploadPromises, sourceType]);

    return <PopoverButton
        buttonProps={{size: 'large', startIcon: <Add/>, variant: 'outlined', children: 'Add song'}}
        positiveLabel="Upload"
        onPositiveClick={onSubmit}
    >
        <List sx={{width: '20em'}}>
            <ListItem>
                <ListItemText>Source type</ListItemText>
                <ListItemSecondaryAction>
                    <ToggleButtonGroup size="small" exclusive value={sourceType}
                                       onChange={(event, value) => setSourceType(value as SourceType)}>
                        <ToggleButton value="youtube">Youtube</ToggleButton>
                        <ToggleButton value="spotify">Spotify</ToggleButton>
                    </ToggleButtonGroup>
                </ListItemSecondaryAction>
            </ListItem>
            <ListItem>
                <ListItemText>Song URL</ListItemText>
                <ListItemSecondaryAction>
                    <TextField sx={{width: '10em'}} size="small" value={url}
                               onChange={event => setUrl(event.target.value)}/>
                </ListItemSecondaryAction>
            </ListItem>
        </List>
    </PopoverButton>;
}

export default AddSongButton;
