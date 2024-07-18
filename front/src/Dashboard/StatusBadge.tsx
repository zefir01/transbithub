import * as React from "react";
import {Badge} from "reactstrap";
import {data, IStrings} from "../localization/Dashboard/StatusBadge"
import {useStrings} from "../Hooks";

interface IStatusBadgeProps {
    isNew: boolean;
    isNewMessage: boolean;
    isChanged: boolean;
}

export function StatusBadge(props: IStatusBadgeProps) {
    const strings: IStrings = useStrings(data);
    return(
      <>
          {props.isNew ? <Badge key="isNew" color="danger">{strings.new}</Badge> : null}
          {props.isNewMessage ? <Badge key="isNewMessage" color="warning">{strings.newMessage}</Badge> : null}
          {props.isChanged ? <Badge key="isChanged" color="success">{strings.changed}</Badge> : null}
      </>
    );
}