import React, {ReactNode, useRef, useState} from "react";
import {Button as MuiButton, ButtonProps, Divider, List, ListItem, Popover, styled} from "@mui/material";

const Button = styled(MuiButton)`
  border-radius: 10em;
`;

type PopoverButtonProps = {
    buttonProps?: Partial<ButtonProps>
    positiveLabel?: string
    negativeLabel?: string
    onPositiveClick: () => void
    children?: ReactNode
};

function PopoverButton({buttonProps, positiveLabel = 'OK', negativeLabel = 'Cancel', onPositiveClick, children}: PopoverButtonProps) {
    const [open, setOpen] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    return <>
        <Button ref={buttonRef} onClick={() => setOpen(true)} {...buttonProps}/>
        <Popover
            open={open}
            anchorEl={buttonRef.current}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            onClose={() => setOpen(false)}
        >
            <List sx={{width: '20em'}}>
                {children}
                <Divider/>
                <ListItem sx={{justifyContent: 'end', pb: '0'}}>
                    <Button size="medium" onClick={() => setOpen(false)}>{negativeLabel}</Button>
                    <Button size="medium" onClick={() => {
                        setOpen(false);
                        onPositiveClick();
                    }}>{positiveLabel}</Button>
                </ListItem>
            </List>
        </Popover>
    </>
}

export default PopoverButton;
