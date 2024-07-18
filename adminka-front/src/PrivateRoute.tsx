import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'

interface PrivateRouteProps extends RouteProps {
    // tslint:disable-next-line:no-any
    component: any;
    isSignedIn: boolean;
}

export const PrivateRoute = (props: PrivateRouteProps) => {
    const { component: Component, isSignedIn, ...rest } = props;

    return (
        <Route
            {...rest}
            render={props =>
                isSignedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
            }
        />
    )
}
