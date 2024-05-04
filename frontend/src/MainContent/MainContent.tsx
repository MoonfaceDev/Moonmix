import {Box, Container, styled, Typography} from "@mui/material";
import lennon from "../Assets/lennon.png";
import React, {Dispatch, SetStateAction, useCallback, useState} from "react";
import SongCard from "./SongCard/SongCard";
import RandomizeButton from "./RandomizeButton";
import {Song} from "../types";
import {api} from "../api";

const LennonCircle = styled('div')(({theme}) => `
  position: absolute;
  bottom: 10px;
  z-index: -1;
  width: 100px;
  height: 100px;
  background: ${theme.palette.mode === 'light' ? '#DAE3F3' : '#202630'};
  box-shadow: ${theme.palette.mode === 'light' ? '#DAE3F3' : '#202630'} 0 0 500px 500px;
  border-radius: 100%;
`);

type MainContentProps = {
    songHistory: Song[]
    setSongHistory: Dispatch<SetStateAction<Song[]>>
}

function MainContent({songHistory, setSongHistory}: MainContentProps) {
    const [game, setGame] = useState<boolean>(false);
    const [getRandom] = api.useLazyRandomQuery();

    const addSong = useCallback(() => {
        getRandom({}).then(({data}) => {
            if (data) {
                setSongHistory(prev => [...prev, data]);
            }
        });
    }, [getRandom, setSongHistory]);

    return <Container sx={{flex: '1', display: 'flex'}} maxWidth="xl">
        <Box sx={{
            flex: '1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'start',
            margin: '0 5em',
            gap: '2em'
        }}>
            <Typography variant="h2" fontWeight="bold">
                Discover how to <Typography variant="h2" fontWeight="bolder" color="primary"
                                            component="span">Moonmix</Typography>.
            </Typography>
            <Typography variant="h5">
                Get ready to turn up the excitement at your next party with an exhilarating game that will have everyone
                on their feet!
            </Typography>
            <div/>
            <RandomizeButton
                onStart={() => {
                    setGame(true);
                    addSong();
                }}
            />
        </Box>
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'end',
            alignItems: 'center',
            gap: '5em',
            position: 'relative'
        }}>
            <Box sx={{flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: '5em'}}>
                {songHistory.length > 0 && <SongCard
                    song={songHistory[songHistory.length - 1]}
                    onPrevious={songHistory.length > 1 ? () => setSongHistory(prev => prev.filter((value, index) => index !== prev.length - 1)) : undefined}
                    onNext={game ? addSong : undefined}
                />}
            </Box>
            <img src={lennon} alt="John Lennon"/>
            <LennonCircle/>
        </Box>
    </Container>
}

export default MainContent;