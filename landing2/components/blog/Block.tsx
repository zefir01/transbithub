import {Box, Typography} from "@material-ui/core";

export interface BlockProps {
    title: string;
    children?: React.ReactNode;
}

export function Block(props: BlockProps) {
    return (
        <>
            <Box paddingTop={5}>
                <Typography variant={"h4"}>
                    {props.title}
                </Typography>
            </Box>
            <Typography variant={"body1"}>
                {props.children}
            </Typography>
        </>
    );
}

export function Block2(props: BlockProps) {
    return (
        <>
            <Box paddingTop={5}>
                <Typography variant={"h5"}>
                    {props.title}
                </Typography>
            </Box>
            <Typography variant={"body1"}>
                {props.children}
            </Typography>
        </>
    );
}