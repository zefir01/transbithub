import * as React from "react";
import {FunctionComponent, ReactNode, useEffect, useState} from "react";
import {Card, CardBody, Col, Input, Row, FormGroup, Label, Collapse} from "reactstrap";
import {TextAreaAutoSimple} from "./Mesenger/TextAreaAuto";
import {site} from "../global";
import {Invoice} from "../Protos/api_pb";
import {data, IStrings} from "../localization/Invoices/InvoiceIntegration";
import {useStrings} from "../Hooks";

interface IMyRowProps {
    content1?: ReactNode;
    content2?: ReactNode;
    content3?: ReactNode;

}

const MyRow: FunctionComponent<IMyRowProps> = (props) => {

    return (
        <Row className="pt-3">
            <Col sm={2} className="font-weight-bold">
                {props.content1}
            </Col>
            <Col sm={4}>
                {props.content2}
            </Col>
            <Col sm={6}>
                <div className="text-muted">
                    {props.content3}
                </div>
            </Col>
        </Row>
    );
};

export interface IntegrationParams {
    error: boolean;
    disabled: boolean;
    redirect: string;
    webhook: {
        url: string;
        clientKey: string;
        clientCert: string;
        serverCert: string;
        required: boolean;
    } | null;

}

export interface InvoiceIntegrationProps {
    className?: string;
    invoice: Invoice.AsObject | null;
    onChange: (params: IntegrationParams) => void;
}

export function InvoiceIntegration(props: InvoiceIntegrationProps) {
    const strings: IStrings=useStrings(data);
    const [enabled, setEnabled] = useState(false);
    const [intType, setIntType] = useState(0);
    const [clientKey, setClientKey] = useState("");
    const [clientCert, setClientCert] = useState("");
    const [serverCert, setServerCert] = useState("");
    const [required, setRequired] = useState(false);
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (!props.invoice) {
            return;
        }
        setEnabled(!props.invoice.nointegration);
        if (props.invoice.nointegration) {
            return;
        }
        if (props.invoice.redirect) {
            setIntType(0);
            setUrl(props.invoice.redirect);
        } else if (props.invoice.webhook) {
            setIntType(1);
            setUrl(props.invoice.webhook.url);
            setClientCert(props.invoice.webhook.clientcrt);
            setClientKey(props.invoice.webhook.clientkey);
            setServerCert(props.invoice.webhook.servercrt);
            setRequired(props.invoice.webhook.required);
        }
    }, [props.invoice]);

    useEffect(() => {
        if (!enabled) {
            props.onChange({
                error: false,
                disabled: true,
                redirect: "",
                webhook: null
            });
            return;
        }

        let params: IntegrationParams = {
            disabled: false,
            error: false,
            redirect: "",
            webhook: null
        };
        try {
            new URL(url);
        } catch {
            params.error = true;
        }
        if (intType === 1) {
            if (clientKey === "" || clientCert === "" || serverCert === "") {
                params.error = true;
            }
        }
        if (intType === 0) {
            params.redirect = url;
        } else {
            params.webhook = {
                url,
                clientKey,
                clientCert,
                serverCert,
                required
            }
        }
        props.onChange(params);
    }, [enabled, intType, clientKey, clientCert, serverCert, url, required]);

    function isUrlInvalid() {
        try {
            new URL(url);
            return false;
        } catch {
            return true;
        }
    }


    return (
        <Card className={props.className}>
            <CardBody>
                <MyRow content1={strings.use1}
                       content2={
                           <FormGroup check>
                               <Label check>
                                   <Input type="checkbox" checked={enabled} onClick={() => setEnabled(!enabled)}/>{' '}
                                   {strings.use}
                               </Label>
                           </FormGroup>
                       }
                       content3={strings.useDesc}
                />
                <Collapse isOpen={enabled}>
                    <MyRow content1={strings.type}
                           content2={
                               <FormGroup check>
                                   <Row>
                                       <Col>
                                           <Label check>
                                               <Input type="radio" name="radio1" checked={intType === 0}
                                                      onClick={() => setIntType(0)}/>{' '}
                                               {strings.redirect}
                                           </Label>
                                       </Col>
                                   </Row>
                                   <Row>
                                       <Col>
                                           <Label check>
                                               <Input type="radio" name="radio1" checked={intType === 1}
                                                      onClick={() => setIntType(1)}/>{' '}
                                               {strings.webhook}
                                           </Label>
                                       </Col>
                                   </Row>
                               </FormGroup>
                           }
                           content3={
                               <>
                                   {strings.typeInfo}
                                   <br/>
                                   {strings.typeInfo1}
                               </>
                           }
                    />
                    <MyRow content1={"URL"}
                           content2={
                               <Input value={url} onChange={event => setUrl(event.currentTarget.value)}
                                      invalid={isUrlInvalid()}
                               />
                           }
                           content3={intType === 0 ? strings.urlInfo1 : strings.urlInfo2}
                    />
                    <Collapse isOpen={intType === 1}>
                        <MyRow content1={strings.clientCert}
                               content2={<TextAreaAutoSimple minRows={10} small={true}
                                                             value={clientCert}
                                                             onChange={value => setClientCert(value)}
                                                             invalid={clientCert === ""}
                               />}
                               content3={
                                   <>
                                       {strings.clientCertDesc1}
                                       <br/>
                                       {strings.clientCertDesc2}
                                       <br/>
                                       {strings.clientCertDesc3}{site}{strings.clientCertDesc4}
                                       <br/>
                                       {strings.clientCertDesc5}
                                   </>
                               }
                        />
                        <MyRow content1={strings.clientKey}
                               content2={<TextAreaAutoSimple minRows={10} small={true}
                                                             value={clientKey}
                                                             onChange={value => setClientKey(value)}
                                                             invalid={clientKey === ""}
                               />}
                               content3={
                                   <>
                                       {strings.clientKeyDesc}
                                   </>
                               }
                        />
                        <MyRow content1={strings.serverCert}
                               content2={<TextAreaAutoSimple minRows={10} small={true}
                                                             value={serverCert}
                                                             onChange={value => setServerCert(value)}
                                                             invalid={serverCert === ""}
                               />}
                               content3={
                                   <>
                                       {strings.serverCertDesc1}
                                       <br/>
                                       {strings.serverCertDesc2}
                                       <br/>
                                       {strings.serverCertDesc3}
                                       <br/>
                                       {strings.serverCertDesc4}
                                   </>
                               }
                        />
                        <MyRow content1={strings.required}
                               content2={
                                   <FormGroup check>
                                       <Label check>
                                           <Input type="checkbox" checked={required}
                                                  onClick={() => setRequired(!required)}/>
                                       </Label>
                                   </FormGroup>
                               }
                               content3={
                                   <>
                                       {strings.requiredDesc}
                                   </>
                               }
                        />
                    </Collapse>
                </Collapse>
            </CardBody>
        </Card>
    )
}