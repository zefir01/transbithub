import {FunctionComponent, default as React} from "react";
import {Button, ButtonProps} from "reactstrap";

interface Props extends ButtonProps {
    loading: boolean;
    isSmall?: boolean;
}

export const LoadingBtn: FunctionComponent<Props> = (props) => {
    let newProps = {
        ...props,
        disabled: props.loading ? true : props.disabled,
        loading: undefined,
        className: props.isSmall ? props.className + " btn-sm" : props.className
    };
    return (
        <Button {...newProps}>
            {props.loading ?
                <span className="spinner-border spinner-border-sm"/>
                : null}
            {" "}
            {props.children}
        </Button>
    );
}