import {makeStyles, Theme} from "@material-ui/core";

export interface BlogImageProps{
    alt?: string;
    src: string;
}
const imageCb = makeStyles((theme: Theme) => (
    {
        root: {
            width: "100%",
            display: "block",
            [theme.breakpoints.up('xs')]: {
                width: "100%",
            },
            [theme.breakpoints.up('sm')]: {
                width: "100%",
            },
            [theme.breakpoints.up('md')]: {
                width: "50%",
            },
            [theme.breakpoints.up('lg')]: {
                width: "50%",
            },
            [theme.breakpoints.up('xl')]: {
                width: "50%",
            },
        }
    }
));
export function BlogImage(props: BlogImageProps){
    const imageStyle = imageCb();
    return(
        <img alt={props.alt} className={imageStyle.root} src={props.src}/>
    )
}