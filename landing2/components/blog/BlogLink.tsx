import Link from "next/link";

export interface BlogLinkProps{
    text: string;
    link: string;
}
export function BlogLink(props: BlogLinkProps){
    return(
        <Link passHref href={props.link}><a>{props.text}</a></Link>
    )
}