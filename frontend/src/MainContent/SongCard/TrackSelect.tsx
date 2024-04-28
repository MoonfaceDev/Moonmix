import {SelectChangeEvent} from "@mui/material/Select/SelectInput";
import {TrackType} from "../../types";
import {ListItemIcon, ListItemText, MenuItem, Select, styled} from "@mui/material";
import FontAwesomeSvgIcon from "../../FontAwesomeSvgIcon";
import {faDrum, faGuitar, faMicrophone, faMusic, faSliders} from "@fortawesome/free-solid-svg-icons";
import {Piano} from "@mui/icons-material";
import React, {Dispatch, ReactNode} from "react";

const StyledTrackSelect = styled(Select)`
  width: 8em;
  
  .MuiSelect-select {
    display: flex;
    align-items: center;

    .MuiListItemIcon-root {
      min-width: 2em;
    }
    
    .MuiListItemText-root {
      margin: 0;
    }
  }
`;

type TrackItemProps = {
    label: string
    icon: ReactNode
}

function TrackItem({label, icon}: TrackItemProps) {
    return <>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{label}</ListItemText>
    </>
}

type TrackSelectProps = {
    trackType: TrackType
    onChange: Dispatch<TrackType>
}

function TrackSelect({trackType, onChange}: TrackSelectProps) {
    return <StyledTrackSelect
        size="small"
        MenuProps={{disablePortal: true}}
        value={trackType}
        onChange={(event: SelectChangeEvent) => onChange(event.target.value as TrackType)}
    >
        <MenuItem value="all"><TrackItem label="All" icon={<FontAwesomeSvgIcon icon={faMusic}/>}/></MenuItem>
        <MenuItem value="bass"><TrackItem label="Bass" icon={<FontAwesomeSvgIcon icon={faGuitar}/>}/></MenuItem>
        <MenuItem value="drums"><TrackItem label="Drums" icon={<FontAwesomeSvgIcon icon={faDrum}/>}/></MenuItem>
        <MenuItem value="other"><TrackItem label="Other" icon={<FontAwesomeSvgIcon icon={faSliders}/>}/></MenuItem>
        <MenuItem value="piano"><TrackItem label="Piano" icon={<Piano sx={{fontSize: '1.25em'}}/>}/></MenuItem>
        <MenuItem value="vocals"><TrackItem label="Vocals" icon={<FontAwesomeSvgIcon icon={faMicrophone}/>}/></MenuItem>
    </StyledTrackSelect>;
}

export default TrackSelect;
