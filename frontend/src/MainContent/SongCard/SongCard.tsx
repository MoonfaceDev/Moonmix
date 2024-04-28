import {Box, Card, CardContent, CardMedia, IconButton, Slider, styled, Typography} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {Song, TrackType} from "../../types";
import {Pause, PlayArrow, SkipNext, SkipPrevious} from "@mui/icons-material";
import {BASE_URL} from "../../api";
import TrackSelect from "./TrackSelect";

const StyledCard = styled(Card)(({theme}) => `
  display: flex;
  border-radius: 1em;

  && {
    background: ${theme.palette.background.paper};
    
    .MuiCardContent-root {
      padding: 1em 1em 0;
    }
  }
`);

const StyledSlider = styled(Slider)`
  .MuiSlider-thumb {
    width: 0.5em;
    height: 0.5em;
  }
`;

export type SongCardProps = {
    song: Song
    onPrevious?: () => void
    onNext?: () => void
};

function SongCard({song: [id, metadata], onPrevious, onNext}: SongCardProps) {
    const [trackType, setTrackType] = useState<TrackType>('all');
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        if (audioRef.current) {
            setIsPlaying(false);
            audioRef.current.load();
            setProgress(0);
        }
    }, [audioRef, id, trackType]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.onplay = () => setIsPlaying(true);
            audioRef.current.onpause = () => setIsPlaying(false);
        }
    }, [audioRef]);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                setLoading(true);
                audioRef.current.play().finally(() => setLoading(false));
            } else {
                audioRef.current.pause();
            }
        }
    }, [audioRef, isPlaying]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (audioRef.current) {
                setProgress(audioRef.current.currentTime || 0);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [audioRef, isPlaying]);

    return <>
        <StyledCard variant="outlined">
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <CardContent>
                    <Typography component="div" variant="h5">
                        {metadata.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                        {metadata.artist}
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <TrackSelect trackType={trackType} onChange={setTrackType}/>
                        <Box sx={{flex: '1', justifyContent: 'flex-end', display: 'flex', alignItems: 'center'}}>
                            <IconButton disabled={loading || !onPrevious} onClick={onPrevious}><SkipPrevious/></IconButton>
                            <IconButton disabled={loading} onClick={() => setIsPlaying(prev => !prev)}>{isPlaying
                                ? <Pause sx={{height: 38, width: 38}}/>
                                : <PlayArrow sx={{height: 38, width: 38}}/>
                            }</IconButton>
                            <IconButton disabled={loading || !onNext} onClick={onNext}><SkipNext/></IconButton>
                        </Box>
                    </Box>
                    <StyledSlider
                        sx={{width: '20em'}}
                        value={progress}
                        max={audioRef.current ? audioRef.current.duration || 1 : 1}
                        onChange={(event: Event, value: number | number[]) => {
                            if (audioRef.current && typeof value === 'number' && Number.isFinite(value)) {
                                setProgress(value);
                                audioRef.current.currentTime = value;
                            }
                        }}
                    />
                </CardContent>
            </Box>
            <CardMedia
                component="img"
                sx={{width: '10em'}}
                image={metadata.image_url}
            />
        </StyledCard>
        <audio ref={audioRef}>
            <source src={`${BASE_URL}song/${id}/${trackType}`} type="audio/mp3"/>
        </audio>
    </>
}

export default SongCard;
