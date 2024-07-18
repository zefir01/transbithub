import {IAd} from "../../helpers";
import {Box, Card, CardContent, CardHeader, Typography} from "@material-ui/core";

export interface TermsProps {
    ad: IAd;
}

export function Terms(props: TermsProps) {
    const arr=props.ad.terms.split("\n");
    return (
        <Card className={"w-100"}>
            <CardContent>
                <Box mb={3}>
                    <Typography variant={"h5"}>
                        Условия сделки:
                    </Typography>
                </Box>
                {arr.map((p, i)=> <Typography key={i}>{p}</Typography>)}
            </CardContent>
        </Card>
    )
}